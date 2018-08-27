const bip39 = require('./platform').bip39;
const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1");

const Address = require('./address.js');
const Encrypt = require('./asymmetric.js');
const Bytes = require("./bytes.js")
const Symmetric = require('./symmetric.js');




const Language = {
    English: "English",
    France: "France"
}

const Algorithm = {
    SECP256K1: "secp256k1"

}

class KeyPair {
    /**
     * constructor
     * @param {string} privKey - hex string
     * @param {string} pubKey - hex string
     * @param {string} address - hex string
     */
    constructor(privKey, pubKey, address) {
        this.privKey = privKey
        this.pubKey = pubKey
        this.address = address
    }
    
    
    /**
     * sign - sign a message using this key
     * @param {string} msg - message to be signed
     * @return {string} hex representation of DER signature
     */
    sign(msg) {
        return Encrypt.sign(this.privKey, msg);
    }

    /**
     * verify - verify a message using this key
     * @param {string} msg - message to be verified
     * @param {string} signature - hex string of DER signature
     * @return {boolean} true/false
     */
    verify(msg, signature) {
        console.log("PubKey", this.pubKey)
        return Encrypt.verify(this.pubKey, msg, signature)
    }
    
    /**
     * stringify - turn this object into a JSON string
     */
    stringify() {
        let obj = {
            privateKey: this.privKey,
            publicKey: this.pubKey,
            address: this.address
        }

        return JSON.stringify(obj);
    }


    /**
     * encrypted - get encrypted version of this keyPair
     * @param {string} secretKey - hex representation of secretKey used to encrypt this keyPair
     */
    encrypted(secretKey){
        let obj = [this.privKey, this.pubKey, this.address]
        return Symmetric.encrypt(JSON.stringify(obj), secretKey)
    }


}

/**
 * createMnemonic - create a list of 12 words as mnemonic as a base for privateKey generation
 * @param {string} language, optional - one type of language. Currently only support English. See Enum Language defined in this file
 * @param {string} algorithm, optional - which algorithm to be used. See enum Algorithm defined in this file.
 * @return {string} mnemonic - a list of 12 words
 */
KeyPair.createMnemonic = function (language, algorithm) {
    language = language || Language.English;
    if (language != Language.English) throw Error("Only Support English now")
    algorithm = algorithm || Algorithm.SECP256K1
    if (algorithm != Algorithm.SECP256K1) throw Error("Only support secp256k1 now")

    let randomBytes = Bytes.random(16) // 128 bits
    let mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex').slice(2)) //  12 word phrase

    return mnemonic
}


/**
 * validateMnemonic - validate whether a strin is a correct mnemonic
 * @param {string} mnemonic
 * @param {string} language - optional. Default is English
 * @return {boolean} true/false indicating whether the string is a correct mnemonic
 */
KeyPair.validateMnemonic = function(mnemonic, languange){
    return bip39.validateMnemonic(mnemonic, language)
}


/**
 * fromPrivateKey - create KeyPair from privateKey
 * @param {privateKey} - hex string representation of private key
 * @return {KeyPair} - KeyPair from this privateKey
 */
KeyPair.fromPrivateKey = function(privateKey){
    let res = Address.fromPrivate(privateKey)
    return new KeyPair(res.privateKey, res.publicKey, res.address)
}


/**
 * fromMnemonic - create a KeyPair from mnemonic
 * @param {mnenomic} - a list of 12 words
 * @return {KeyPair} - KeyPair
 */
KeyPair.fromMnemonic = function(mnemonic) {
    if (mnemonic == "") {
        throw Error("Mnemonic must not be an empty string.")
    }
    let res = Address.create(mnemonic)
    return new KeyPair(res.privateKey, res.publicKey, res.address)
}

/**
 * fromEncryptedKeyPair - decrypt an encrypted keyPair
 *
 * @param {string} encryptedKP - hex-encoded encrypted keypair
 * @param {string} secretKey - hex-encoded key used to decrypt
 * @return {KeyPair} KeyPair
 */
KeyPair.fromEncryptedKeyPair = function (encryptedKP, secretKey) {
    let obj =  JSON.parse(Symmetric.decrypt(encryptedKP, secretKey))
    return new KeyPair(obj[0], obj[1], obj[2])

}


class KeyBase {

    constructor(db) {
        this.db = db;
    }


    createMnemonic (language, algorithm) {
        return createMnemonic(language, algorithm)
    }

    createBip39Seed(mnemonic) {
        let seed = bip39.mnemonicToSeedHex(mnemonic)
        return seed
    }

    /**
     * save KeyInfo with name to Db.
     * @param {name} name of keyInfo
     * @param {keyInfo} KeyInfo object
     * @return {Promise}
     */
    save(name, keyInfo) {
        return this.db.put(name, keyInfo.stringify())
    }

    /**
    * save KeyInfo with name to Db.
    * @param {name} name of keyInfo
    * @return {Promise}
    */
    get(name) {
        return this.db.get(name)
    }

}


module.exports = {
    Language,
    Algorithm,
    KeyPair,
    KeyBase,
}

if (require.main === module) {
    //let levelup = require('levelup')
    //let leveldown = require('leveldown')
    //let db = levelup(leveldown('./mydb'))   

    //let keyInfo = new KeyInfo("Tan","ShareRingiscaring")
    //let signature = keyInfo.sign("Toilatan")
    //let verifiedResult = keyInfo.verify("Toilatan",signature)
    //if( verifiedResult ) {
        //console.log("signature is verified")
    //}
    //else console.log("signature is not verfied")

    //let kb = new KeyBase(db)
    
   /*  console.log(keyInfo.stringify())
    let kb = new KeyBase(db);
    kb.save("Tan", keyInfo).then((val) => {
            return kb.get("Tan")
        }).then((val) => {
                console.log("============")
                console.log(JSON.par se(val))
    }) */

    // Generate a mnemonic
    let mne = KeyPair.createMnemonic()
    console.log(mne)
    
    // Generate KeyPair from Mnemonic
    // KeyPair = {"address": xxxx,
    //             "privKey": xxxx,
    //             "pubKey": xxxx}
    let kp = KeyPair.fromMnemonic(mne)
    console.log(kp)
    
    // Generate KeyPair from PrivateKey
    let kp1 = KeyPair.fromPrivateKey(kp.privKey)
    console.log(kp1)

    // KeyPair generated from Mnemonic and PrivateKey should be the same
    console.log("Should has the same value?", kp === kp1)
    
    // Generate secretKey to encrypt KeyPair
    // Symmetric.generateSecretKey(password, salt)
    let secretKey = Symmetric.generateSecretKey("123", "123")
    console.log("SecretKey:", secretKey)
    
    // Encrypt KeyPair into a ciphertext
    let encryptedKP = kp.encrypted(secretKey)
    console.log("Encrypt:", encryptedKP)
    
    // Decrypt the ciphertext into KeyPair
    let decrypted = KeyPair.fromEncryptedKeyPair(encryptedKP, secretKey)
    console.log(decrypted)

    
    // Using KeyPair to Sign a message
    let msg = "Trang"
    let signature = kp.sign(msg)
    console.log("Signature:", signature)

    // Using KeyPair to verify a message
    console.log("Verified?:", kp.verify(msg, signature))

}
