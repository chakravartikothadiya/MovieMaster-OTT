from flask import Flask, jsonify, abort
from utils import recommend_movies_byGenre, recommend_movies_byMovies

app = Flask(__name__)

@app.route('/predict/genre/<genre>/<int:number>',methods=['GET'])
def results_byGenres(genre, number):
    try:
        prediction = recommend_movies_byGenre(genre, number)
        return jsonify(prediction)
    except:
        abort(404, "Movies related to requested {} is not in the database!".format(genre))

@app.route('/predict/movie/<movie>/<int:number>',methods=['GET'])
def results_byMovies(movie, number):
    try:
        prediction = recommend_movies_byMovies(movie, number)
        return jsonify(prediction)
    except:
        abort(404, "No Movies based on given movie: {} in the database!".format(movie))

if __name__ == "__main__":
    app.run(debug=True)