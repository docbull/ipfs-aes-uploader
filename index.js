const process = require('process')
const minimist = require('minimist')
const { Web3Storage, getFilesFromPath } = require('web3.storage')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let filePaths = [];

// readDirectory reads all files that you entered with `--path` parameters
// and encrypts the all files using AES.
async function readDirectory(videoName) {
    const algorithm = "aes-256-cbc";
    const password = "docbullwatson";
    
    return new Promise((resolve) => {
        fs.readdir(path.join(videoName), (err, files) => {
            if (files) {
                files.forEach(file => {
                    let chunk = fs.readFileSync(`${videoName}/${file}`);
                    var cipher = crypto.createCipher(algorithm, password);
                    var encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);
                    try {
                        fs.writeFileSync(`${videoName}/${file}`, encrypted);
                    } catch (err) {
                        console.error(err);
                    }
                    filePaths.push(`${videoName}/${file}`);
                });
                resolve('successfully read the directory');
            }
        });
    });
}

// Web3StorageUploader uploads video chunks into IPFS network using Web3.Storage.
async function Web3StorageUploader(web3Token) {
    const token = web3Token;

    return new Promise(async function (resolve) {
        const storage = new Web3Storage({ token });
        const files = []
        for (const path of filePaths) {
            const pathFiles = await getFilesFromPath(path);
            files.push(...pathFiles);
        }
    
        console.log(`📤 Uploading ${files.length} files`);
        const cid = await storage.put(files);
        console.log(`📦 Video chunks are added with CIDv1: "${cid}"`);

        console.log('🎉 The video is successfully uploaded!');
        resolve(cid);
    })
}

async function main () {
    const args = minimist(process.argv.slice(2));
    const token = args.token;
    const path = args.path;
    await readDirectory(path);
    const res = await Web3StorageUploader(token);
    console.log(res);
}

main()