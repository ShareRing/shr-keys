'use strict';

var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = require('base-x')(BASE58)
const hex = require('base-x')('0123456789abcdef')

const sha3_256 = require('js-sha3').sha3_256;
const Buffer = require('buffer').Buffer;


/**
 * calculate *checksum* of payload. 
 * Checksum = first 4 bytes of sha3_256
 * @param {array} payload - data to be checked
 * @return {Buffer} first 4 bytes of hash value of payload, using sha3_256
 */
function checksum(payload) {
  return Buffer.from(sha3_256(Buffer.concat(payload))).toString('hex').slice(0, 4);
}


/**
 * encode Ethereum address and network to ShareLedger address
 * ShareLedger address: base58 encode of (networkID + Ethereum address + checksum)
 *
 * @param {string} network - hex value of network, prefixed by '0x'
 * @param {string} address - hex value of Ethereum address, prefixed by '0x'
 * @return ShareLedger address
 */
function encode({ network, address }) {
  const payload = [hex.decode(network.slice(2)), Buffer.from(address.slice(2)).toString('hex')]

  payload.push(checksum(payload))

  return base58.encode(Buffer.concat(payload))
}


/**
 * decode ShareLedger address to network and Ethereum address
 * @param {string} encoded - base58 encoding of ShareLedger address
 * @return {object} {network, address}
 */
function decode(encoded) {
  const data = Buffer.from(base58.decode(encoded))
  const netLength = data.length - 24

  const network = data.slice(0, netLength)
  const address = data.slice(netLength, 20 + netLength)

  const check = data.slice(netLength + 20)
  if (check.equals(checksum([network, address]))) {
    return {
      network: `0x${hex.encode(network)}`,
      address: `0x${address.toString('hex')}`
    }
  } else {

    throw new Error('Invalid address checksum')
  }
}

module.exports = { checksum, encode, decode };