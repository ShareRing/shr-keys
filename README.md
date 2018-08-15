# Cryptographic practical details
This document explain how cryptographic primitives and algorithms are used in ShareLedger to ensure security and data integrity.

## Key Generation
For easy migration from Ethereum to ShareLedger, Ethereum key schema is utilized. Meaning, elliptic curve `secp256k1` is used as key generation schema.


The address consists of:


* Network Id - to avoid replay attack
* Last 20 bytes of the public key - similar to Ethereum
* Four bytes of SHA3-based error checking code - to avoid human typo mistakes

We use *Base58Check* to encode the final result. *Base58Check* is [Bitcoin key encoding schema]( https://en.bitcoin.it/wiki/Base58Check_encoding ) which encodes byte arrays into human typable string. The schema allows several benefits over *base64* encoding for keys:
 
 
* Avoid `0O` and `Il` mistake, which looks like the same in some fonts
* Non-alphanumeric string is not accepted as legitimate address
* No punctuation to line-break
* Double-clicking to select the whole number as one word is feasible

## Key Symmetric Encryption

Key Ecryption uses symmetric enryption AES-256 with Counter mode. Public key can be generated from Private Key.
This key is to encrypt KeyPair for local storage in Mobile and WebPortal. Defined in `symmetric.js`

Steps to encrypt Private Key:


* Generate *secret key* using *generateSecretKey*
* encrypt using above *secret key*, input data in *string* format
* decrypt using above *secret key*, input data is *hex format* of ciphertext


## Key Asymetric Signing and Verification

Key Asymmetric uses SECP256K1 algorithm. Defined in `asymmetric.js`

* *Sign* requires privateKey in hex-encoded string and data of string type
* *Verify* requires publicKey and signature in hex-encoded string and data of string type
* Note that data is hashed using SHA256 before signing

## KeyPair class

KeyPair provides methods for keys creation and usage. KeyPair is used to sign transactions in ShareLedger. Defined in `keybase.js`

* *KeyPair creation*: can be done using `KeyPair.fromMnenomic`, `KeyPair.fromPrivateKey` or `KeyPair.fromEncryptedKeyPair`
    * `fromMnemonic`: mnemonic is a list of 12 words generated using `KeyPair.createMnemonic`
    * `fromPrivateKey`: re-generate the whole KeyPair from *private key*
    * `fromEncryptedKeyPair`: recover KeyPair from an encrypted string using method `encrypted`

* *KeyPair sign and verify* uses according *sign* and *verify* functions


## Inspiration
  * [MNID](https://github.com/uport-project/mnid)
  * Ethereum key schema
  * Bitcoin *Base58Check*


## Example

* `address.js` : keys generation
* `encode.js` : encoding public key into adress and decode address into publickey. 
* There is an usage example inside `encode.js`
* `symmetric.js`: encrypt using aes-256
