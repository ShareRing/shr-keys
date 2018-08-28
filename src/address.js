const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line

const {keccak256, keccak256s} = require("./hash");
const Bytes = require("./bytes");
const utils = require("./utils");


const create = mnemonic => {
    const mnemonicHash = keccak256(mnemonic)
    return fromPrivate(mnemonicHash)
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


  const ecKey = secp256k1.keyFromPrivate(privateKey);

  // Public Key without "0x"
  const publicKey = ecKey.getPublic(false, 'hex');
  let address = addressFromPublic(publicKey)


  return {
    address: address,
    privateKey: privateKey,
	publicKey: publicKey,
  }
}




module.exports = { create, toChecksum, fromPrivate, addressFromPublic};


if (require.main == module){
    let kb = require('./keybase')
    let mnemonic = kb.KeyPair.createMnemonic(kb.Language.English, kb.Algorithm.SECP256K1)
    console.log("Mnemonic:", mnemonic)
    console.log("Address:", create(mnemonic))
    console.log("Custom Mnemonic:", "trang tran")
    console.log("Address:", create("trang tran"))
}
