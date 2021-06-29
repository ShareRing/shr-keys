const bip39 = require('./platform').bip39;

class EnglishMnemonic {
  static wordlist = bip39.wordlists.english;
  static mnemonicMatcher = /^[a-z]+( [a-z]+)*$/;

  constructor(mnemonic) {
    if (!EnglishMnemonic.mnemonicMatcher.test(mnemonic)) {
      throw new Error("Invalid mnemonic format");
    }

    const words = mnemonic.split(" ");
    const allowedWordsLengths = [12, 15, 18, 21, 24];
    if (allowedWordsLengths.indexOf(words.length) === -1) {
      throw new Error(`Invalid word count in mnemonic (allowed: ${allowedWordsLengths} got: ${words.length})`);
    }

    for (const word of words) {
      if (EnglishMnemonic.wordlist.indexOf(word) === -1) {
        throw new Error("Mnemonic contains invalid word");
      }
    }

    // Throws with informative error message if mnemonic is not valid
    bip39.mnemonicToEntropy(mnemonic);

    this.data = mnemonic;
  }

  toString() {
    return this.data;
  }
}

module.exports = EnglishMnemonic;