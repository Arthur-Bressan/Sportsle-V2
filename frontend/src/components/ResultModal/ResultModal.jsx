// frontend/src/components/ResultModal/ResultModal.jsx

export default function ResultModal({ won, guessesCount, onPlayAgain }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={{ ...styles.title, color: won ? "#2ecc71" : "#e74c3c" }}>
          {won ? "Você acertou! 🎉" : "Não foi dessa vez 😔"}
        </h2>

        <p style={styles.text}>
          {won
            ? `Parabéns! Você descobriu o atleta em ${guessesCount} tentativa${guessesCount > 1 ? "s" : ""}.`
            : "O atleta do dia era diferente. Tente novamente amanhã!"}
        </p>

        <button onClick={onPlayAgain} style={styles.button}>
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    backgroundColor: "#1e1e2e",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
    border: "2px solid #3a3a4a",
  },
  title: {
    fontSize: "28px",
    margin: "0 0 12px 0",
  },
  text: {
    color: "#b0b0c0",
    fontSize: "16px",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  button: {
    padding: "12px 32px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};