const process = require('process')
const minimist = require('minimist')
const { Web3Storage, getFilesFromPath } = require('web3.storage')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

let filePaths = [];

// readDirectory reads all files that you entered with `--path` parameters
// and encrypts the all files using AES.
async function readDirectory(fileName, key) {
    const algorithm = "aes-256-cbc";
    const password = key;
    
    return new Promise((resolve) => {
        fs.readdir(path.join(fileName), (err, files) => {
            if (files) {
                files.forEach(file => {
                    let chunk = fs.readFileSync(`${fileName}/${file}`);
                    var cipher = crypto.createCipher(algorithm, password);
                    var encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);
                    try {
                        fs.writeFileSync(`${fileName}/${file}`, encrypted);
                    } catch (err) {
                        console.error(err);
                    }
                    filePaths.push(`${fileName}/${file}`);
                });
                resolve('successfully read the directory');
            }
        });
    });
}

// Web3StorageUploader uploads files into IPFS network using Web3.Storage.
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
        console.log(`📦 Files are added with CIDv1: "${cid}"`);

        console.log('🎉 The files is successfully uploaded!');
        resolve(cid);
    })
}

async function main () {
    const args = minimist(process.argv.slice(2));
    const path = args.path;
    const key = args.key;
    const token = process.env.Web3Token;

    await readDirectory(path, key);
    const res = await Web3StorageUploader(token);
    console.log(res);
}

main()