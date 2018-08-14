const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line
const CryptoJS = require('crypto-js');

const utils = require('./utils');



/*
 * Sign data using privateKey
 * @param {string} privateKey - hex string representing byte array
 * @param {string} data - string of data to be signed
 * @return {string} return - hex representation of DER encoded signature
 */
const sign = (privateKey, data) => {
    privateKey = utils.cleanHex(privateKey)
	let mesHash = CryptoJS.SHA256(data).toString()
    let signature = secp256k1.sign(mesHash, privateKey, {canonical: true})
    return utils.bytesToHex(signature.toDER())
}

/*
 * verify - signed data using public key
 * @param {string} publicKey - hex string
 * @param {string} data - message to be verified
 * @param {string} sig - hex representation of DER encoded signature
 * @return {boolean} true/false
 */
const verify = (publicKey, data, sig) => {
	let mesHash = CryptoJS.SHA256(data).toString()
	return secp256k1.verify(mesHash, sig, publicKey)
}


module.exports = {
    sign,
	verify
}

if (require.main == module){
	const address = require("./address")


	// Sign
    let privateKey = "ab83994cf95abe45b9d8610524b3f8f8fd023d69f79449011cb5320d2ca180c5"
	let res = address.fromPrivate(privateKey)

    console.log("Address:", res.address)

	let createTx = {
        //"creator":"CF54B74BB4AC9380BFF00F2BE911FC61E541C635",
        "creator": res.address.toUpperCase(),
		"hash":"MTExMTEx",
		"uuid": "112233",
		"status":true,
		"fee":1,
	}

	let message = JSON.stringify(createTx)
    console.log("Message:", message)
	let signature = sign(privateKey, message)
    console.log("Sig:", signature)

	// Verify
	const ecKey = secp256k1.keyFromPrivate(privateKey);
	let mesHash = CryptoJS.SHA256(message).toString()
	let pubKey = ecKey.getPublic(false, "hex")
	pkBytes = utils.hexToBytes(pubKey)
	console.log("Verify", secp256k1.verify(mesHash, signature, pkBytes))

}


