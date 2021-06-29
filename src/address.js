'use strict';

const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line
const Bech32 = require('bech32');
const CryptoJS = require('crypto-js');
const { keccak256, keccak256s } = require("./hash");
const Bytes = require("./bytes");
const utils = require("./utils");
const Bech32Prefix = require("./bech32prefix");



/**************** BECH32 **********************/
const addressToBech32 = address => {
  let words = Bech32.toWords(utils.hexToBytes(address))
  let bech32Address = Bech32.encode(Bech32Prefix.Bech32PrefixAccAddr, words)
  return bech32Address
}

const bech32ToAddress = bech32Address => {
  let words = Bech32.decode(bech32Address).words
  return utils.bytesToHex(Bech32.fromWords(words)).toUpperCase()
}

const addressToValidatorBech32 = address => {
  let words = Bech32.toWords(utils.hexToBytes(address))
  let bech32Address = Bech32.encode(Bech32Prefix.Bech32PrefixValAddr, words)
  return bech32Address
}
const bech32ValidatorToAddress = bech32Address => {
  let words = Bech32.decode(bech32Address).words
  return utils.bytesToHex(Bech32.fromWords(words)).toUpperCase()
}
/**************** ADDRESS **********************/


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
  for (let i = 0; i < 40; i++)
    checksumAddress += parseInt(addressHash[i], 16) > 7
      ? address[i].toUpperCase()
      : address[i];

  return checksumAddress;
}


const addressFromPublic = publicKey => {
  let buf = Buffer.from(publicKey, 'hex')
  //let hash = crypto.createHash('sha256').update(buf).digest('hex')
  let hash = CryptoJS.SHA256(CryptoJS.enc.Base64.parse(buf.toString('base64'))).toString(CryptoJS.enc.Hex)
  buf = Buffer.from(hash, 'hex')
  //hash = crypto.createHash('ripemd160').update(buf).digest('hex')
  hash = CryptoJS.RIPEMD160(CryptoJS.enc.Base64.parse(buf.toString('base64'))).toString(CryptoJS.enc.Hex)
  return addressToBech32(hash)
}


const fromPrivate = privateKey => {
  privateKey = utils.cleanHex(privateKey)


  const ecKey = secp256k1.keyFromPrivate(privateKey);

  // Public Key without "0x"
  const publicKey = ecKey.getPublic(true, 'hex');
  let address = addressFromPublic(publicKey)


  return {
    address: address,
    privateKey: privateKey,
    publicKey: publicKey,
  }
}

export {
  create,
  toChecksum,
  fromPrivate,
  addressFromPublic,
  addressToBech32,
  bech32ToAddress,
  addressToValidatorBech32,
  bech32ValidatorToAddress
};