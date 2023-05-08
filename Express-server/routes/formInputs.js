const express = require("express");
const router = express.Router();
const firebaseFunctions = require("../data/FirebaseAuth");
const admin = require("firebase-admin");
const { db } = require("../firebase/db");
const {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} = require("firebase/auth");
const { app } = require("../firebase/authentication");

const session = require("express-session");
let user_session = {};
let firebase_auth = {};

router.route("/RegistrationForm").post(async (req, res) => {
  try {
    let userResponse;
    //creating user and initially setting the verification to be false

    const getUserEmail = await db
      .collection("users")
      .where("email", "==", req.body.email)
      .get();
    if (req.body.password.length < 6) {
      return res.json({
        message: "password length should be greater than or equal to 6",
      });
    }
    if (!getUserEmail.empty)
      return res.json({ message: "email already exists" });

    if (getUserEmail.empty) {
      userResponse = await admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false,
      });
    }

    if (userResponse) {
      // Inserting user in firebase collection
      const userJson = {
        email: req.body.email,
        password: req.body.password,
      };

      const response = await db
        .collection("users")
        .doc(req.body.email)
        .set(userJson);
    }
    res.json(userResponse);
  } catch (e) {
    res.json(e);
  }
});

router.route("/LoginForm").post(async (req, res) => {
  try {
    const getUser = await db
      .collection("users")
      .where("email", "==", req.body.email)
      .get();

    // const emailID = getUser.docs[0].data().email;
    const password = req.body.password;

    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      req.body.email,
      password
    );
    const user = userCredential.user;
    if (!user) {
      res.json("no user found");
    }
    req.session.uid = user.uid;
    req.session.emailID = req.body.email;
    req.session.login = true;
    req.session.save();

    firebase_auth = { user };
    user_session = req.session;
    res.json(req.session);
    // res.json(user);
  } catch (e) {
    res.json(e);
  }
});

router.route("/Logout").post(async (req, res) => {
  try {
    user_session = {};
    const auth = getAuth(app);
    auth
      .signOut()
      .then((result) => {
        console.log("User has been signed out successfully");
        res.json({ message: "user logged out" });
      })
      .catch((e) => {
        console.log("Error occurred during sign out:", e);
        res.json(e);
      });
  } catch (e) {
    res.json(e);
  }
});

router.route("/ResetPassword").post(async (req, res) => {
  try {
    // Send a password reset email to the user's email address
    const auth = getAuth(app);
    const resp = await sendPasswordResetEmail(auth, req.body.email);
    res.json({ message: "Password reset email sent" });
  } catch (e) {
    res.json(e);
  }
});

router.route("/verify").get(async (req, res) => {
  try {
    res.json(user_session);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
