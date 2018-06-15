var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = require('base-x')(BASE58)
const hex = require('base-x')('0123456789abcdef')

const sha3_256 = require('js-sha3').sha3_256;
const Buffer = require('buffer').Buffer;




function checksum (payload) {
  return new Buffer(sha3_256(Buffer.concat(payload)), 'hex').slice(0, 4)
}

function encode ({network, address}) {
  const payload = [hex.decode(network.slice(2)), new Buffer(address.slice(2), 'hex')]
  payload.push(checksum(payload))
  return base58.encode(Buffer.concat(payload))
}

function decode (encoded) {
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


//function isMNID (encoded) {
  //try {
    //const data = Buffer.from(base58.decode(encoded))
    //return data.length > 24 && data[0] === 1
  //} catch (e) {
    //return false
  //}
//}


module.exports = { checksum, encode, decode};

if (require.main === module) {
    // using public key generated from ETH
    const eth_address = require('./address');
    res = eth_address.create("abc")
    console.log("Generated Key:", res)
    
    // Encode public key into address
    res1 = encode({network: "0x1", address: res.address})
    console.log("Encoded Key:", res1)

    // Decode text back to public key
    res2 = decode(res1)
    console.log("Decoded Key:", res2)


    // check whether *encode* and *decode* function correctly
    if ( res.address.toUpperCase() != res2.address.toUpperCase() ) {
        console.log("Mismatch address", res.address, res2.address);
    } else {
        console.log("Correct address");
    }

}

