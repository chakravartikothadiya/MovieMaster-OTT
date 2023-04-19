const mongoCollections = require('../config/mongoCollections');
const validationFunctions = require('./validation');
const movies = mongoCollections.movies;
let { ObjectId } = require('mongodb');
  
const createlike = async (movieId, userId, value) => {
    // Validation

    await validationFunctions.idValidator(movieId);
    await validationFunctions.idValidator(userId);
    //await validationFunctions.valueValidator(value);
    

    movieId = movieId.trim();
    userId = userId.trim();
    value = value.trim();
   
    // Current timestamp
    timestamp = new Date();
    
    let moviesCollection = await movies();

    // Creating new like object
    let newLike = {
        userId: ObjectId(userId),
        value: value,
        timestamp: timestamp
    }

    //Check if event is present or not
    let movie = await moviesCollection.findOne({_id: ObjectId(movieId)})
    if (!movie) {
        throw {statusCode: 404, error:`No such movie with id: ${movieId}`}
    }

    let result = await moviesCollection.updateOne({_id:ObjectId(movieId)}, {$addToSet: {likes: newLike}});
    if (result.modifiedCount === 0) {
      throw {statusCode: 500, error: `Unable to add the like value to the movie`};
    }

    let updatedMovie = await moviesCollection.findOne({_id: ObjectId(movieId)});
    if(!updatedMovie){
      throw {statusCode: 404, error: `Unable to get movie after adding the like value`};
    }

    return updatedMovie;
};