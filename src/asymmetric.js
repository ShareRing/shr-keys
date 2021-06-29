'use strict';

const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line
const CryptoJS = require('crypto-js');

const Utils = require('./utils');
const Bytes = require('./bytes.js');
const Address = require('./address.js');
const Symmetric = require('./symmetric.js');



/*
 * Sign data using privateKey
 * @param {string} privateKey - hex string representing byte array
 * @param {string} data - string of data to be signed
 * @return {string} return - hex representation of DER encoded signature
 */
const sign = (privateKey, data) => {
  privateKey = Utils.cleanHex(privateKey)
  let mesHash = CryptoJS.SHA256(data).toString()
  let privKeyBytes = Utils.hexToBytes(privateKey)
  let signature = secp256k1.sign(mesHash, privKeyBytes, { canonical: true })
  return Utils.bytesToHex(signature.toDER())
}

/*
 *generate signature in tendermint format 
*/
const signTm = (privateKey, data) => {
  privateKey = Utils.cleanHex(privateKey)
  let mesHash = CryptoJS.SHA256(data).toString()
  let privKeyBytes = Utils.hexToBytes(privateKey)
  let signature = secp256k1.sign(mesHash, privKeyBytes, { canonical: true })
  let r = signature.r.toArray()
  let s = signature.s.toArray()
  let p = 32 - r.length
  r = addPadding(p, r)
  p = 32 - s.length
  s = addPadding(p, s)
  return Utils.bytesToHex([...r, ...s])
}

const addPadding = (padLength, data) => {
  if (padLength > 0) {
    let pad = []
    for (let i = 0; i < padLength; i++) {
      pad = [0, ...pad]
    }
    data = [...pad, ...data]
  }
  return data
}
/*
 * verify - signed data using public key
 * @param {string} publicKey - hex string
 * @param {string} data - message to be verified
 * @param {string} sig - hex representation of DER encoded signature
 * @return {boolean} true/false
 */
const verify = (publicKey, data, sig) => {
  let pubKeyBytes = Utils.hexToBytes(publicKey)
  let mesHash = CryptoJS.SHA256(data).toString()
  return secp256k1.verify(mesHash, sig, pubKeyBytes)
}



/*
 * encrypt - encrypt using ECIES
 * @param {string} publicKey - hex string of publicKey used to encrypt ( 65 bytes = 130 chars )
 *
 * @param {string} data - message to be encrypted
 *
 * @param {string} opts -
 * * opts.iv {string} - Initialization Vector IV 16 bytes random Bytes
 * * opts.ephemPrivKey {string} - hexString of ephemeral privateKey
 *
 * @return {string} JSON of the object including
 * * iv {string} - hex String of Initialization Vector - random 16 bytes = 32 chars
 * * ephemPubKey {string} - hex String of ephemeral public Key - 65 bytes  = 130 chars
 * * ciphertext {string} - hex string of ciphertext (Variable size)
 * * mac {string} - message authentication code ( 32 bytes = 64 chars )
 *
 */
const encrypt = function (publicKey, data, opts) {
  opts = opts || {}

  // generate ephemeral private key
  let ephemPrivKey = opts.ephemPrivKey || Bytes.random(32)

  // deduce ephemeral key pair
  let ephemKeyPair = secp256k1.keyFromPrivate(ephemPrivKey)

  // key pair of counterpart
  let otherKeyPair = secp256k1.keyFromPublic(Utils.hexToBytes(publicKey))

  // Derive sharedSecret using ECDH
  let sharedSecret = ephemKeyPair.derive(otherKeyPair.getPublic())

  // Deduce a shared Hash
  let sharedHash = CryptoJS.SHA512(sharedSecret).toString()

  // encryptionKey is the first 32 bytes
  let encryptionKey = sharedHash.slice(0, 32)

  // macKey is the last 32 byte
  let macKey = sharedHash.slice(32)

  // Initialization vector
  let iv = opts.iv || Bytes.random(16)

  // ciphertext is aes256 using CTR
  let ciphertext = Symmetric.encrypt(data, encryptionKey, iv)

  // compute Mac
  let mac = CryptoJS.SHA256(iv + ephemKeyPair.getPublic(false, 'hex') + ciphertext, macKey).toString()

  return JSON.stringify({
    iv: iv,
    ephemPubKey: ephemKeyPair.getPublic(false, 'hex'),
    ciphertext: ciphertext,
    mac: mac
  })
}

/*
 * decrypt - decrypt using ECIES
 * @param {string} privateKey - hex string of privateKey used to encrypt ( 32 bytes = 64 chars )
 * @param {string} ciphertext - message to be decrypted
 * @return {string} plaintext
 */
const decrypt = function (privateKey, ciphertext) {
  ciphertext = JSON.parse(ciphertext)

  let keyPair = secp256k1.keyFromPrivate(privateKey)

  let ephemKeyPair = secp256k1.keyFromPublic(Utils.hexToBytes(ciphertext.ephemPubKey))

  let sharedSecret = keyPair.derive(ephemKeyPair.getPublic())

  let sharedHash = CryptoJS.SHA512(sharedSecret).toString()

  let encryptionKey = sharedHash.slice(0, 32)

  let macKey = sharedHash.slice(32)

  let mac = CryptoJS.SHA256(ciphertext.iv + ciphertext.ephemPubKey + ciphertext.ciphertext, macKey).toString()

  if (mac != ciphertext.mac) {
    console.log(mac)
    console.log(ciphertext.mac)
    throw Error("Mismatch MAC during ECIES decryption")
  }

  return Symmetric.decrypt(ciphertext.ciphertext, encryptionKey, ciphertext.iv)
}

module.exports = {
  sign,
  signTm,
  verify,
  encrypt,
  decrypt
};


