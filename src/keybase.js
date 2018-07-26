let Address = require('./address.js');
let Encrypt = require('./encrypt.js');
let bip39 = require('bip39')
const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1");
const Bytes = require("./bytes.js")




const Language = {
    English: "English",
    France: "France"
}

const Algorithm = {
    SECP256K1: "secp256k1"

}

class KeyInfo {

    constructor(name,pass) {
        let salt = Bytes.random(16).toString()//crypto.randomBytes(16).toString();
        console.log(salt)
        this.privKey = Encrypt.generateSecretKey(pass, salt)
        this.pubKey = Encrypt.publicKeyFromPrivateKey(this.privKey)            
        this.pass = pass
        this.name = name
    }

    sign(msg) {             
        return Encrypt.sign(msg, this.privKey.toString("hex"));
    }

    verify(msg, signature) {
        return Encrypt.verifySignature(msg, signature, this.pubKey)
    }

    stringify() {
        let obj = { name: this.name, pubKey: this.pubKey, privKey: this.privKey.toString('hex'), pass: this.pass };
        return JSON.stringify(obj);
    }


}

class KeyBase {

    constructor(db) {
        this.db = db;
    }

    createMnemonic(language, algorithm) {
        language = language || Language.English;
        if (language != Language.English) throw Error("Only Support English now")
        algorithm = algorithm || Algorithm.SECP256K1
        if (algorithm != Algorithm.SECP256K1) throw Error("Only support secp256k1 Now")

        let randomBytes = crypto.randomBytes(16) // 128 bits        
        let mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex')) //  12 word phrase       

        return mnemonic
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

if (require.main === module) {
    let levelup = require('levelup')
    let leveldown = require('leveldown')
    let db = levelup(leveldown('./mydb'))   
    let keyInfo = new KeyInfo("Tan","ShareRingiscaring")
    let signature = keyInfo.sign("Toilatan")
    let verifiedResult = keyInfo.verify("Toilatan",signature)
    if( verifiedResult ) {
        console.log("signature is verified")
    }
    else console.log("signature is not verfied")
    
   /*  console.log(keyInfo.stringify())
    let kb = new KeyBase(db);
    kb.save("Tan", keyInfo).then((val) => {
            return kb.get("Tan")
        }).then((val) => {
                console.log("============")
                console.log(JSON.par se(val))
    }) */




}