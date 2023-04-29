const express = require("express");
const router = express.Router();
const firebaseFunctions = require("../data/FirebaseAuth");
const admin = require("firebase-admin");
const { db } = require("../firebase/db");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { app } = require("../firebase/authentication");
let user_session = {};
let firebase_auth = {};

router.route("/RegistrationForm").post(async (req, res) => {
  try {
    console.log("in RegistrationForm");
    console.log(req.body);
    let userResponse;
    //creating user and initially setting the verification to be false

    const getUserEmail = await db
      .collection("users")
      .where("email", "==", req.body.email)
      .get();
    // console.log(getUserEmail);
    if (req.body.password.length < 6) {
      return res.json({
        message: "password length should be greater than or equal to 6",
      });
    }
    if (!getUserEmail.empty)
      return res.json({ message: "email already exists" });

    if (getUserEmail.empty) {
      // console.log("1");
      userResponse = await admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false,
      });
      // console.log(2);
    }
    // console.log(userResponse);
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

      // if (response) console.log(true);
    }
    res.json(userResponse);
  } catch (e) {
    // res.status(e.statusCode || 500).json(e);
    res.json(e);
  }
});

router.route("/LoginForm").post(async (req, res) => {
  try {
    // console.log(user_session);
    console.log("in LoginForm");

    const getUser = await db
      .collection("users")
      .where("email", "==", req.body.email)
      .get();

    // console.log(getUser);
    // const emailID = getUser.docs[0].data().email;
    const password = req.body.password;

    const auth = getAuth(app);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      req.body.email,
      password
    );
    const user = userCredential.user;
    // console.log(user);
    if (!user) {
      res.json("no user found");
    }
    req.session.emailID = req.body.email;
    req.session.login = true;
    firebase_auth = { user };
    // console.log(req.session);
    user_session.session = req.session;
    console.log("User_session", user_session);
    res.json(req.session);
    // res.json(user);
  } catch (e) {
    res.json(e);
  }
});

router.route("/Logout").post(async (req, res) => {
  try {
    console.log("inside Logout route");
    console.log(user_session);
    user_session = {};
    console.log(user_session);
    res.json({ message: "user logged out" });
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
