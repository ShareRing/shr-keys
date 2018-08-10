const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line

const {keccak256, keccak256s} = require("./hash");
const Bytes = require("./bytes");
const Encrypt = require("./encrypt");
const utils = require("./utils");

const create = entropy => {
  const innerHex = keccak256(Bytes.concat(Bytes.random(32), entropy || Bytes.random(32)));
  const middleHex = Bytes.concat(Bytes.concat(Bytes.random(32), innerHex), Bytes.random(32));
  const outerHex = keccak256(middleHex);
  return fromPrivate(outerHex);
}

const toChecksum = address => {
  const addressHash = keccak256s(address.slice(2));
  let checksumAddress = "0x";
  for (let i = 0; i < 40; i++)
    checksumAddress += parseInt(addressHash[i + 2], 16) > 7
      ? address[i + 2].toUpperCase()
      : address[i + 2];
  return checksumAddress;
}


const addressFromPublic = publicKey => {
  // Hash of byte array of public key
  const publicHash = keccak256(utils.hexToBytes(publicKey));
  const address = toChecksum("0x" + publicHash.slice(-40));
  return address
}

const fromPrivate = privateKey => { 
  const buffer = new Buffer(privateKey.slice(2), "hex");
  const ecKey = secp256k1.keyFromPrivate(buffer);

  // Public Key without "0x"
  const publicKey = ecKey.getPublic(false, 'hex');
  let address = addressFromPublic(publicKey)


  return {
    address: address,
    privateKey: privateKey,
	publicKey: publicKey,
  }
}




module.exports = { create, toChecksum, fromPrivate };


if (require.main == module){
    create("test")
}
