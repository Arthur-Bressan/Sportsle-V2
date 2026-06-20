// frontend/src/components/SearchBar/SearchBar.jsx

import { useState, useEffect, useRef } from "react";

export default function SearchBar({ athletes, onSelect, disabled }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Filtra atletas conforme digita
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const filtered = athletes.filter((a) =>
      a.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 8));
    setOpen(filtered.length > 0);
  }, [query, athletes]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(athlete) {
    setSelected(athlete);
    setQuery(athlete.name);
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selected || disabled) return;
    onSelect(selected);
    setQuery("");
    setSelected(null);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form} ref={wrapperRef}>
      <div style={styles.inputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="Digite o nome do atleta..."
          disabled={disabled}
          style={styles.input}
          autoComplete="off"
        />

        {open && (
          <ul style={styles.dropdown}>
            {results.map((athlete) => (
              <li
                key={athlete.id}
                onClick={() => handleSelect(athlete)}
                style={styles.dropdownItem}
              >
                {athlete.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" disabled={!selected || disabled} style={styles.button}>
        Enviar
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "8px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #3a3a4a",
    backgroundColor: "#1e1e2e",
    color: "#e0e0e0",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    listStyle: "none",
    backgroundColor: "#2a2a3e",
    borderRadius: "0 0 8px 8px",
    border: "2px solid #3a3a4a",
    borderTop: "none",
    zIndex: 100,
    maxHeight: "240px",
    overflowY: "auto",
  },
  dropdownItem: {
    padding: "10px 16px",
    cursor: "pointer",
    color: "#e0e0e0",
    fontSize: "14px",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c5ce7",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};