## AES-based IPFS Encryption
IPFS is a distributed file system that allows users to interact any contents that uploaded on IPFS network. Users can upload and download the contents if they know CID of the contents. When some user access to data using IPFS, the data would be cached in their storage, and this is the powerful thing of IPFS.

However, this may cause security problem when you try to delete the contents that you uploaded because someone may cached your data. And also the data is accessable to anyone that you never want to.

For these problems, we can encrypt the data and upload the encrypted data on IPFS network. In this repository, we used AES that symmetric key based encryption algorithm.

### Web3.Storage

This app uses [Web3.Storage](https://web3.storage), a Filecoin-backed Pinning Service, for uploading data to IPFS network. You can easily set up Web3.Storage API in `.env` file. [Here](https://web3.storage/docs/#quickstart) is an instruction for setting up your Web3.Storage API.

You can run this example as follow:
```
$ node index.js --path=where/is/your/data --key=password
```