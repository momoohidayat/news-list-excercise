import { NewsApiError, NewsResponse } from './types';

const API_KEY = '183daca270264bad86fc5b72972fb82a';
const BASE_URL = 'https://newsapi.org/v2';

export async function fetchTopHeadlines(page: number = 1, pageSize: number = 10): Promise<NewsResponse> {
  const response = await fetch(
    `${BASE_URL}/top-headlines?country=us&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    const error = await response.json() as NewsApiError;
    throw new Error(error.message || 'Failed to fetch news');
  }

  return response.json();
}

export async function searchNews(query: string, page: number = 1, pageSize: number = 10): Promise<NewsResponse> {
  const response = await fetch(
    `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    const error = await response.json() as NewsApiError;
    throw new Error(error.message || 'Failed to search news');
  }

  return response.json();
}

const newsApi = {
  fetchTopHeadlines,
  searchNews,
};

export default newsApi;