const admin = require('firebase-admin')
var serviceAccount = require('../token/investigacion-d003b-4d12b05b5845.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:  'investigacion-d003b.appspot.com'
});

const bucket = admin.storage().bucket()

module.exports = {
  bucket
}