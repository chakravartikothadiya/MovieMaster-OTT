const mongoCollections = require("../config/mongoCollections");
// const validationFunctions = require("./validation");
const likes = mongoCollections.likes;
const { ObjectId } = require("mongodb");

const getTotalLikesDislikes = async (movieId) => {
  //validate movieId
  console.log("Inside getTotalLikesDislikes");
  console.log(movieId);

  let moviesCollection = await likes();

  //fecth the counte of all the like
  console.log("Before count");
  let likeCount = await moviesCollection.count({
    movieId: movieId,
    value: "like",
  });
  console.log(likeCount);

  //fetch the count of all the dislikes
  let dislikeCount = await moviesCollection.count({
    movieId: movieId,
    value: "dislike",
  });
  console.log(dislikeCount);

  const result = {
    likes: likeCount,
    dislikes: dislikeCount,
  };

  return result;
};

const getLikeDislike = async (movieId, userId) => {
  // await validationFunctions.isValidator(movieId);
  // await validationFunctions.isValidator(userId);

  if (!movieId || !userId) {
    return null;
  }

  movieId = movieId.trim();
  userId = userId.trim();

  let moviesCollection = await likes();

  //fetch the movie
  let movie = await moviesCollection.findOne({
    movieId: movieId,
    userId: userId,
  });
  if (!movie) {
    return null;
  }

  return movie.value;
};

const createlike = async (movieId, userId, value) => {
  // Validation
  // await validationFunctions.idValidator(movieId);
  // await validationFunctions.idValidator(userId);
  //await validationFunctions.valueValidator(value);

  if (!movieId || !userId) {
    return;
  }

  movieId = movieId.trim();
  userId = userId.trim();

  // Current timestamp
  let timestamp = new Date();

  let moviesCollection = await likes();

  const newLike = {
    movieId: movieId,
    userId: userId,
    value: value,
    timestamp: timestamp,
  };

  //Check if likeDislike is present or not
  let likeDislike = await moviesCollection.findOne({
    movieId: movieId,
    userId: userId,
  });
  if (!likeDislike) {
    //Add new one
    let likeDislikeInsert = await moviesCollection.insertOne(newLike);
    if (!likeDislikeInsert.acknowledged) {
      throw {
        statusCode: 500,
        error:
          "Internal Server Error: The LikeDislike was not added to the Database",
      };
    }
  } else {
    //Write a code to update
    let updateLikeDislike = await moviesCollection.updateOne(
      {
        movieId: movieId,
        userId: userId,
      },
      { $set: { value: value } }
    );

    if (updateLikeDislike.modifiedCount === 0) {
      throw {
        statusCode: 500,
        error: `Unable to add the like value to the movie`,
      };
    }
  }
};

module.exports = {
  createlike,
  getLikeDislike,
  getTotalLikesDislikes,
};
