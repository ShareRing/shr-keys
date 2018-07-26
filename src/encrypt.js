const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line
const CryptoJS = require('crypto-js');
const aesjs = require('aes-js');
//let crypto = require('crypto')

KEY_LENGTH = 256; // Length of secret key. Can be 128, 192, or 256

/**
 * encrypt *plaintext* using *secretKey*, supposedly generated uisng *generateSecretKey* function
 * @param {string} plaintext - text to be encrypted
 * @param {array} secretKey - key used to encrypt plaintext
 * @return {string} hex encoded ciphertext
 */
const encrypt = (plaintext, secretKey) => {
    var textBytes = aesjs.utils.utf8.toBytes(plaintext);

    var aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(5));
    
    var encryptedBytes = aesCtr.encrypt(textBytes);
    
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    return encryptedHex;
}


/**
 * decrypt *ciphertext* using *secretKey*, supposedly generated using *generateSecretKey* function
 * @param {string} ciphertext - hex encoded ciphertext to be decrypted
 * @param {array} secretKey - key used to decrypt ciphertext
 * @return {string} plaintext
 */
const decrypt = (ciphertext, secretKey) => {
    var byteData = aesjs.utils.hex.toBytes(ciphertext);

    var aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(5));

    var decryptedBytes = aesCtr.decrypt(byteData);

    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
}

/**
 * generate secret key
 * @param {string} password - user input password
 * @param {string} salt - system salt
 * @return {Buffer} - array of integer, each integer represent a byte. Array length = KEY_LENGTH / 8
 */
const generateSecretKey = (password, salt) => {
    //return pbkdf2.pbkdf2Sync(password, salt, 1, KEY_LENGTH/8, 'sha512')
    return CryptoJS.PBKDF2(password, salt, {
        keySize: 512/32,
        iterations: 1
    })
}

/**
 * generate public key
 * @param {Buffer} private key  
 * @return {Buffer} -public key
 */
const publicKeyFromPrivateKey = privateKey => {
   let publicKey = secp256k1.keyFromPrivate(privateKey)
    return publicKey;
}

/**
 * sign a message
 * @param {string} msg - message to be signed  
 * @param {string} privatekey  
 * @return {Buffer} - signature
 */
const sign = (msg, privateKey) => {   
  const signature = secp256k1.sign(msg, privateKey);
    return signature;
}

const verifySignature = (msg, signature, publicKey) => {

    const verified = secp256k1.verify(msg, signature, publicKey);
    return verified;

}


module.exports = { encrypt, decrypt, generateSecretKey, publicKeyFromPrivateKey, sign, verifySignature };


if ( require.main == module ){
    console.log("Generate key...");
    key = generateSecretKey("ShareRingiscaring", "220NguyenDinhChieu");
    console.log(key);
    
    plaintext = "ShareRing";

    ciphertext = encrypt(plaintext, key);
    console.log("Encrypted data: ", ciphertext);


    result = decrypt(ciphertext, key);
    console.log("Decrypted data:", result);
}
