const elliptic = require("elliptic");
const secp256k1 = new (elliptic.ec)("secp256k1"); // eslint-disable-line
const CryptoJS = require('crypto-js');
const utils = require('./utils');




const sign = (privateKey, data) => {
	let mesHash = CryptoJS.SHA256(data).toString()
    let signature = secp256k1.sign(mesHash, privateKey.slice(2), {canonical: true})
    return utils.bytesToHex(signature.toDER())
}

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
    let privateKey = "0xab83994cf95abe45b9d8610524b3f8f8fd023d69f79449011cb5320d2ca180c5"
	let res = address.fromPrivate(privateKey)


	let createTx = {
		"creator": res.address.toUpperCase().slice(2),
		"hash":"MTExMTEx",
		"uuid": "112233",
		"status":true,
		"fee":1,
	}

	let message = JSON.stringify(createTx)
	let signature = sign(privateKey, message)

	// Verify
	const ecKey = secp256k1.keyFromPrivate(buffer);
	let mesHash = CryptoJS.SHA256(message).toString()
	let pubKey = ecKey.getPublic(false, "hex")
	pkBytes = utils.hexToBytes(pubKey)
	console.log("Verify", secp256k1.verify(mesHash, signature, pkBytes))

}


