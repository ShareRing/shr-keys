

/*
 * Convert hex string to a byte array
 * @param {hex} hex string
 * @return {array} a byte array
 */
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}


/*
 * Convert a byte array to hex string
 * @param {bytes} a byte array
 * @return {string} a hex string
 */
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

/*
 * Remove 0x prefix if presents
 * @param {string} a hex string prefixed with 0x or not
 * @return {string} a hex string without 0x
 */
function cleanHex(str) {
    if ( str.startsWith("0x") )
        return str.slice(2)
    else
        return str
}

function objToHex (encrypted) {
  let dataToSend = ''
  Object.keys(encrypted).forEach(key => {
    let data = encrypted[key].toString('hex')
    dataToSend += (key + '.' + data + '.')
  })
  dataToSend = dataToSend.substring(0, dataToSend.length -1)
  return dataToSend
}

function hexToObj (hexString) {
  let dataReceived = hexString.split('.')
  let obj = {}
  let l = dataReceived.length / 2
  for (let i = 0; i < l; i++ ) {
    Object.assign(obj, {[dataReceived[2 * i]]: dataReceived[2 * i+1]})
  }
  Object.keys(obj).forEach(key => {
    obj[key] = Buffer.from(obj[key], 'hex')
  })
  return obj  
}

module.exports = {
    hexToBytes,
    bytesToHex,
    cleanHex,
    objToHex,
    hexToObj
}
