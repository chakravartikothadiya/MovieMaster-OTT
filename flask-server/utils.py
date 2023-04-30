import pandas as pd
import numpy as np

# loading the dataset
df = pd.read_csv("recommender.csv")

# Recommender Based on Genre
def recommend_movies(movie_genre, number_of_movies):
    recommended_movies = df[df['genres'] == movie_genre]
    recommended_movies = np.random.choice(recommended_movies['title'], size=number_of_movies, replace=False)
    output_dict = {"movies": recommended_movies.tolist()}
    return output_dict

# Recommender Engine based on movies.
# Not using this one because new movies data is not available to train while API have new movies.
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# # load movie data
# movies = pd.read_csv('movies.csv')
# movies['title'] = movies['title'].apply(lambda x: x.strip())
# count = CountVectorizer(stop_words='english')
# count_matrix = count.fit_transform(movies['genres'])
#
# # calculate cosine similarity
# cosine_sim = cosine_similarity(count_matrix, count_matrix)
#
# # create indices and reverse indices
# indices = pd.Series(movies.index, index=movies['title'])
# reverse_indices = pd.Series(movies['title'], index=movies.index)
#
# def recommend_movies(movie_title, num_recommendations=5):
#
#     movie_idx = indices[movie_title]
#     sim_scores = list(enumerate(cosine_sim[movie_idx]))
#     sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
#     sim_scores = sim_scores[1:num_recommendations+1]
#     movie_indices = [i[0] for i in sim_scores]
#     recommended_movies = reverse_indices[movie_indices].values.tolist()
#     output_dict = {movie_title: recommended_movies}