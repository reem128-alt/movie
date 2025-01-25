const API_BASE_URL = "http://localhost:3001";
import { Movie } from "../types/movie";

export const moviesApi = {
  // GET all movies
  getAllMovies: async () => {
    const response = await fetch(`${API_BASE_URL}/movies`);
    return response.json();
  },

  // GET single movie
  getMovie: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/movies/${Number(id)}`);
    return response.json();
  },

  // POST new movie
  createMovie: async (movie: Omit<Movie, "id">) => {
    let count = Number(localStorage.getItem("count"));

    if (!count) {
      try {
        const moviesResponse = await fetch(`${API_BASE_URL}/movies/`);
        if (!moviesResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const movies = await moviesResponse.json();
        count =
          movies.length > 0
            ? Math.max(...movies.map((m: { id: any }) => m.id)) + 1
            : 1;
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        count = 1;
      }
    }

    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...movie, id: count.toString() }),
    });
    const newCount = count + 1;
    localStorage.setItem("count", newCount.toString());
    return response.json();
  },

  // PATCH update movie
  updateMovie: async (id: number, updates: Partial<Movie>) => {
    const response = await fetch(`${API_BASE_URL}/movies/${String(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  // DELETE movie
  deleteMovie: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/movies/${String(id)}`, {
      method: "DELETE",
    });
    return response.json();
  },
};
