// frontend/src/components/GuessRow/GuessRow.jsx

const LABELS = {
  country: "País",
  sport: "Esporte",
  birth_year: "Ano",
  is_retired: "Aposentado",
};

function formatValue(key, value) {
  if (key === "is_retired") return value ? "Sim" : "Não";
  return value;
}

export default function GuessRow({ guess, comparison, isCorrect }) {
  const attributes = ["country", "sport", "birth_year", "is_retired"];

  return (
    <div style={styles.row}>
      {/* Nome do atleta palpitado */}
      <div style={{
        ...styles.cell,
        ...styles.nameCell,
        backgroundColor: isCorrect ? "#2ecc71" : "#1e1e2e",
      }}>
        {guess.name}
      </div>

      {/* Atributos com cor */}
      {attributes.map((key) => {
        const hit = comparison[key];
        return (
          <div
            key={key}
            style={{
              ...styles.cell,
              backgroundColor: hit ? "#2ecc71" : "#e74c3c",
            }}
          >
            <span style={styles.label}>{LABELS[key]}</span>
            <span style={styles.value}>{formatValue(key, guess[key])}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 0.7fr 0.9fr",
    gap: "4px",
    width: "100%",
  },
  cell: {
    padding: "10px 8px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "13px",
    minHeight: "52px",
  },
  nameCell: {
    fontSize: "15px",
    fontWeight: "bold",
    justifyContent: "center",
  },
  label: {
    fontSize: "10px",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  value: {
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "2px",
  },
};