from flask import Flask, jsonify, render_template
from utils import recommend_movies

app = Flask(__name__)

@app.route('/predict/<movie>/<int:number>',methods=['GET'])
def results(movie, number):
    try:
        prediction = recommend_movies(movie, number)
        return jsonify(prediction)
    except:
        return jsonify("Movie Title requested is not in the database!")

if __name__ == "__main__":
    app.run(debug=True)