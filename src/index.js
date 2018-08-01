const Address = require('./address');
const Encode = require('./encode');
const Encrypt = require('./encrypt');
const Hash = require('./hash');


module.exports = {
    createAccount: function (entropy) {
        return Address.create(entropy);
    },
    encrypt: function (plaintext, secretKey) {
        if(plaintext && secretKey)
        {
            return Encrypt.encrypt(plaintext, secretKey)
        }else {
            return '';
        }

    },
    generateSecretKey: function (password, salt) {
        if(password && salt)
        {
            return Encrypt.generateSecretKey(password, salt)
        }else {
            return '';
        }

    },
    decrypt: function (ciphertext, secretKey) {
        if(ciphertext && secretKey)
        {
            return Encrypt.decrypt(ciphertext, secretKey)
        }else {
            return '';
        }

    },
    encode: function ({network, address}) {
        if(network && address)
        {
            return Encode.encode({network, address})
        }else {
            return '';
        }

    },
    decode: function (encoded) {
        if(encoded)
        {
            return Encode.decode(encoded)
        }else {
            return '';
        }

    },
    hash: function (input){
        if ( input ) {
            return Hash.keccak256(input)
        } else {
            return '';
        }
    },
}
