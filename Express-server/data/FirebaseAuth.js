const registerUser = async (name, username, email, password) => {
  // Create a new user with email and password in Firebase Authentication
  const getUser = await db
    .collection("users")
    .where("username", "==", username)
    .get();

  // If no user is found with the given username, throw an error
  if (getUser.empty) {
    const userCredential = await admin.auth().createUser({
      email,
      password,
    });

    const user = userCredential;
  }

  // Store the user data in Firestore
  await db.collection("users").add({
    name,
    username,
    email,
    password,
  });

  return user;
};

const loginUser = async (username, password) => {
  try {
    // Query Firestore to find user with given username
    const getUser = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    // If no user is found with the given username, throw an error
    if (getUser.empty) {
      throw { statusCode: 400, message: "Invalid username or password" };
    }

    // Get the first (and only) user document from the query snapshot
    const userDoc = getUser.docs[0];

    // Get the user data from the document
    const userData = userDoc.data();

    // Authenticate the user with email and password in Firebase Authentication
    const userCredential = await admin
      .auth()
      .signInWithEmailAndPassword(userData.email, password);

    const user = userCredential.user;

    return user;
  } catch (error) {
    throw { statusCode: 400, message: error.message };
  }
};

module.exports = {
  registerUser,
  loginUser,
};
