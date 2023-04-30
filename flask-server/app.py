from flask import Flask, jsonify, abort
from utils import recommend_movies

app = Flask(__name__)

@app.route('/predict/<genre>/<int:number>',methods=['GET'])
def results(genre, number):
    try:
        prediction = recommend_movies(genre, number)
        return jsonify(prediction)
    except:
        abort(404, "Movies related to requested {} is not in the database!".format(genre))

if __name__ == "__main__":
    app.run(debug=True)