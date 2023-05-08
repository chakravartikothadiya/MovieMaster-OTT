const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
let { ObjectId } = require("mongodb");

const addmovietolist = async (movieId, movieName, moviePoster, userId) => {
  try {
    let check = 0;
    if (!userId) {
      throw `userId is invalid`;
    }
    let user = {
      userId: userId,
      myList: [{ id: movieId, name: movieName, moviePoster: moviePoster }],
    };

    let myList = {
      id: movieId,
      name: movieName,
      moviePoster: moviePoster,
    };

    let moviesList = await movies();
    let userexists = await moviesList.findOne({ userId: userId });
    if (userexists) {
      for (let i = 0; i < userexists.myList.length; i++) {
        if (userexists.myList[i].id == movieId) {
          check++;
        }
      }
      if (check != 0) {
        throw "movie already in MyList";
      } else {
        let insertedMovie = await moviesList.updateOne(
          { userId: userId },
          { $push: { myList: myList } }
        );
      }
    } else {
      let newUserMovie = await moviesList.insertOne(user);
    }
    let fetchmovie = await moviesList.findOne({ userId: userId });

    return fetchmovie;
  } catch (e) {
    console.log(e);
  }
};

const removemoviefromlist = async (movieId, userId) => {
  try {
    let movieList = await movies();
    let removemovie = await movieList.updateOne(
      { userId: userId },
      { $pull: { myList: { id: movieId } } }
    );

    if (removemovie.modifiedCount == 0) {
      throw "could not remove movie";
    }

    let foundUser = await movieList.findOne({ userId: userId });
    return foundUser;
  } catch (e) {
    console.log(e);
  }
};

const getAllmovies = async (userId) => {
  try {
    let movieList = null;
    let movieCollection = await movies();
    if (userId) {
      movieList = await movieCollection.find({ userId: userId }).toArray();
    } else {
      throw `undefined ID`;
    }
    return movieList;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  addmovietolist,
  removemoviefromlist,
  getAllmovies,
};
