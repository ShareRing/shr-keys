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
  //const addressHash = keccak256s(address.slice(2));
  address = utils.cleanHex(address)
  const addressHash = keccak256s(address);
  //let checksumAddress = "0x";
  let checksumAddress = "";

  //for (let i = 2; i < 42; i++)
  for ( let i = 0; i < 40; i++ )
    checksumAddress += parseInt(addressHash[i], 16) > 7
      ? address[i].toUpperCase()
      : address[i];
  return checksumAddress;
}


const addressFromPublic = publicKey => {
  publicKey = utils.cleanHex(publicKey)

  // Hash of byte array of public key
  const publicHash = keccak256(utils.hexToBytes(publicKey));

  // Hashing including "0x"
  const address = toChecksum(publicHash.slice(-40));
  return address
}

const fromPrivate = privateKey => { 
  privateKey = utils.cleanHex(privateKey)


  const buffer = new Buffer(privateKey, "hex");
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
    console.log(create("test"))
    console.log(fromPrivate("ab83994cf95abe45b9d8610524b3f8f8fd023d69f79449011cb5320d2ca180c5"))
}
