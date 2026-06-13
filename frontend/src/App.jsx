import { useEffect, useState } from 'react';

import './App.css'; 

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/health")
      .then((response) => response.json())
      .then((dadosDoBackend) => {
        setData(dadosDoBackend);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao conectar no cano:", error);
        setLoading(false);
      });
  }, []); 

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Sportsle v2 - Frontend</h1>
      
      {loading ? (
        <p>Carregando conexão com o backend...</p>
      ) : data ? (
        <div style={{ background: '#e2e8f0', padding: '15px', borderRadius: '8px' }}>
          <h3>🔌 Resposta do Backend:</h3>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Banco de Dados:</strong> {data.database}</p>
          <p><strong>Mensagem:</strong> {data.message}</p>
        </div>
      ) : (
        <p style={{ color: 'red' }}>Não foi possível conectar ao backend.</p>
      )}
    </div>
  );
}

export default App;