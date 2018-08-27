var bip39

if (typeof document != 'undefined') {
    // I'm on the web!
    console.log('WEB')
    bip39 = require('bip39');

}
else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
  // I'm in react-native
    console.log('REACT-NATIVE')
    bip39 = require('react-native-bip39');
  
}
else {
  // I'm in node js
     console.log('NODEJS');
   bip39 = require('bip39');
}


module.exports = {
    bip39,
}
