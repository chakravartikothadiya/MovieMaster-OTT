const admin = require("firebase-admin");
require("firebase/auth");
require("firebase/firestore");
const credentials = require("./credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
const db = admin.firestore();
module.exports = { db };
