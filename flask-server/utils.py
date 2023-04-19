import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# load movie data
movies = pd.read_csv('movies.csv')
movies['title'] = movies['title'].apply(lambda x: x.strip())

# create count matrix
count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(movies['genres'])

# calculate cosine similarity
cosine_sim = cosine_similarity(count_matrix, count_matrix)

# create indices and reverse indices
indices = pd.Series(movies.index, index=movies['title'])
reverse_indices = pd.Series(movies['title'], index=movies.index)

def recommend_movies(movie_title, num_recommendations=5):

    movie_idx = indices[movie_title]
    sim_scores = list(enumerate(cosine_sim[movie_idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:num_recommendations+1]
    movie_indices = [i[0] for i in sim_scores]
    recommended_movies = reverse_indices[movie_indices].values.tolist()
    output_dict = {movie_title: recommended_movies}
    return output_dict