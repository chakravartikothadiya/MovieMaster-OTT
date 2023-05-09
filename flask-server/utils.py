import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re


# Recommender movies Based on Genre
# loading the dataset
df = pd.read_csv("recommender.csv")

def recommend_movies_byGenre(movie_genre, number_of_movies):
    recommended_movies = df[df['genres'] == movie_genre]
    recommended_movies = np.random.choice(recommended_movies['title'], size=number_of_movies, replace=False)
    output_dict = {"movies": recommended_movies.tolist()}
    return output_dict

# Recommend movies based on movies.
# load movie data
movies = pd.read_csv('movies.csv')

# Helper function to remove year from title
def remove_year(title):
    return re.sub(r'\s*\(\d+\)', '', title)
movies['title'] = movies['title'].apply(remove_year)
movies['title'] = movies['title'].apply(lambda x: x.strip())
count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(movies['genres'])

# calculate cosine similarity
cosine_sim = cosine_similarity(count_matrix, count_matrix)

# create indices and reverse indices
indices = pd.Series(movies.index, index=movies['title'])
reverse_indices = pd.Series(movies['title'], index=movies.index)

def recommend_movies_byMovies(movie_title, num_recommendations=5):

    movie_idx = indices[movie_title]
    sim_scores = list(enumerate(cosine_sim[movie_idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:num_recommendations+1]
    movie_indices = [i[0] for i in sim_scores]
    recommended_movies = reverse_indices[movie_indices].values.tolist()
    if movie_title in recommended_movies:
        recommended_movies.remove(movie_title)
    output_dict = {"movies": recommended_movies}
    return output_dict