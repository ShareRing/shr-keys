import Address from './address';
import Encode from './encode';
import Encrypt from './encrypt';


export default {
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

}