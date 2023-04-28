import pandas as pd
import numpy as np

# loading the dataset
df = pd.read_csv("recommender.csv")

def recommend_movies(movie_genre, number_of_movies):
    recommended_movies = df[df['genres'] == movie_genre]
    recommended_movies = np.random.choice(recommended_movies['title'], size=number_of_movies, replace=False)
    output_dict = {"movies": recommended_movies.tolist()}
    return output_dict