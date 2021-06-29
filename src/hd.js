'use strict';

const getMasterFromSeed = seed => {
  let masterSecret = "Bitcoin seed"
  secret, chainCode = i64(masterSecret, seed)
  return { secret, chainCode }

}

const derivePrivKeyForPath = (master, chainCode, path) => {

}

const derivePrivateKey = (master, chainCode, index, harden) => {

}

exports = {
  getMasterFromSeed,
  derivePrivateKey,
  derivePrivKeyForPath
}