import { useEffect, useState } from 'react';
import './App.css'; 

function App() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados da nova rota de atletas
    fetch("http://localhost:5000/api/v1/athletes")
      .then((response) => response.json())
      .then((dados) => {
        setAthletes(dados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar atletas:", error);
        setLoading(false);
      });
  }, []); 

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-emerald-400 mb-6 text-center">Sportsle v2 - Atletas</h1>
        
        {loading ? (
          <p className="animate-pulse text-gray-400 text-center">Carregando atletas do banco...</p>
        ) : athletes.length > 0 ? (
          <div className="space-y-3">
            {athletes.map((athlete) => (
              <div key={athlete.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg flex items-center justify-between transform hover:scale-105 transition-all">
                <span className="text-xl font-semibold text-slate-200">{athlete.name}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono font-bold">ID: {athlete.id}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-amber-400 text-center">Nenhum atleta encontrado no banco de dados.</p>
        )}
      </div>
    </div>
  );
}

export default App;