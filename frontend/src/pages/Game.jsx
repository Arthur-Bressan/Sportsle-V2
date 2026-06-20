// frontend/src/pages/Game/Game.jsx

import { useState, useEffect } from "react";
import { getAthletes, submitGuess } from "../../services/api";
import SearchBar from "../../components/SearchBar/SearchBar";
import GuessTable from "../../components/GuessTable/GuessTable";
import ResultModal from "../../components/ResultModal/ResultModal";

const MAX_GUESSES = 6;

export default function Game() {
  const [athletes, setAthletes] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Carrega lista de atletas ao montar
  useEffect(() => {
    getAthletes()
      .then(setAthletes)
      .finally(() => setInitialLoading(false));
  }, []);

  async function handleSelect(athlete) {
    if (loading || gameOver) return;

    setLoading(true);

    try {
      const result = await submitGuess(athlete.id);

      const newGuesses = [...guesses, result];
      setGuesses(newGuesses);

      if (result.correct) {
        setWon(true);
        setGameOver(true);
      } else if (newGuesses.length >= MAX_GUESSES) {
        setWon(false);
        setGameOver(true);
      }
    } catch (err) {
      console.error("Erro ao enviar palpite:", err);
    } finally {
      setLoading(false);
    }
  }

  function handlePlayAgain() {
    setGuesses([]);
    setGameOver(false);
    setWon(false);
  }

  if (initialLoading) {
    return (
      <div style={styles.center}>
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Sportsle</h1>
      <p style={styles.subtitle}>
        Descubra o atleta do dia — {guesses.length}/{MAX_GUESSES} tentativas
      </p>

      <GuessTable guesses={guesses} />

      {/* Linhas vazias como placeholder */}
      {guesses.length < MAX_GUESSES && (
        <div style={styles.tableContainer}>
          {Array.from({ length: MAX_GUESSES - guesses.length }).map((_, i) => (
            <div key={i} style={styles.emptyRow}>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} style={styles.emptyCell} />
              ))}
            </div>
          ))}
        </div>
      )}

      {!gameOver && (
        <div style={{ marginTop: "24px", width: "100%" }}>
          <SearchBar
            athletes={athletes}
            onSelect={handleSelect}
            disabled={loading}
          />
          {loading && <p style={styles.loadingText}>Verificando...</p>}
        </div>
      )}

      {gameOver && (
        <ResultModal
          won={won}
          guessesCount={guesses.length}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#12121a",
    color: "#e0e0e0",
    padding: "40px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  center: {
    minHeight: "100vh",
    backgroundColor: "#12121a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#6c5ce7",
    margin: "0 0 4px 0",
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "32px",
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
  },
  emptyRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 0.7fr 0.9fr",
    gap: "4px",
  },
  emptyCell: {
    height: "52px",
    borderRadius: "6px",
    border: "2px dashed #2a2a3e",
  },
  loadingText: {
    textAlign: "center",
    color: "#888",
    fontSize: "14px",
    marginTop: "8px",
  },
};