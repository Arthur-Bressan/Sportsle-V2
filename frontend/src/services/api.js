// frontend/src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export async function getAthletes() {
  const { data } = await api.get("/api/v1/athletes");
  return data;
}

export async function submitGuess(athleteId) {
  const { data } = await api.post("/api/v1/guess", { athlete_id: athleteId });
  return data;
}