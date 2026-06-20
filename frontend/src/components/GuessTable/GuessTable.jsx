// frontend/src/components/GuessTable/GuessTable.jsx

import GuessRow from "../GuessRow/GuessRow";

export default function GuessTable({ guesses }) {
  if (guesses.length === 0) return null;

  return (
    <div style={styles.container}>
      {guesses.map((g, index) => (
        <GuessRow
          key={index}
          guess={g.guess}
          comparison={g.comparison}
          isCorrect={g.correct}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
  },
};