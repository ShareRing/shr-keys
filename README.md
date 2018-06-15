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

## Inspiration
* [MNID](https://github.com/uport-project/mnid)
* Ethereum key schema
* Bitcoin *Base58Check*


## Example

## Others


* Should we support seed?











