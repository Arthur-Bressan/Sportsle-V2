import { useEffect, useState } from 'react';

export default function GamePage() {
  // --- ESTADOS (Memória do Componente) ---
  const [allAthletes, setAllAthletes] = useState([]); // Lista para o autocomplete
  const [searchQuery, setSearchQuery] = useState(''); // O que o usuário está digitando
  const [filteredOptions, setFilteredOptions] = useState([]); // Opções filtradas na busca
  const [guesses, setGuesses] = useState([]); // Histórico de palpites feitos
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // --- EFEITOS (Comunicação de Inicialização) ---
  useEffect(() => {
    // Busca a lista simples de atletas (id e name) para o autocomplete
    fetch('http://localhost:5000/api/v1/athletes')
      .then((res) => res.json())
      .then((data) => setAllAthletes(data))
      .catch((err) => console.error('Erro ao buscar lista de atletas:', err));
  }, []);

  // --- FUNÇÕES DE INTERAÇÃO ---
  
  // Monitora a digitação e filtra as opções do autocomplete
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 1) {
      const filtered = allAthletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  // Processa o clique em um atleta do autocomplete (Dispara o Palpite)
  const handleSelectAthlete = (athleteId) => {
    setSearchQuery('');
    setFilteredOptions([]);

    // Faz a requisição POST para o endpoint que montamos no Flask
    fetch('http://localhost:5000/api/v1/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athlete_id: athleteId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }

        // Empilha o novo palpite no topo da lista de tentativas
        setGuesses((prevGuesses) => [data, ...prevGuesses]);

        // Verifica se acertou o jogador secreto
        if (data.correct) {
          setGameOver(true);
          setGameWon(true);
        }
      })
      .catch((err) => console.error('Erro ao processar palpite:', err));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        
        {/* Cabeçalho */}
        <header className="text-center my-8">
          <h1 className="text-4xl font-extrabold text-emerald-400 tracking-wider">SPORTSLE V2</h1>
          <p className="text-slate-400 mt-2">Adivinhe o atleta secreto do dia</p>
        </header>

        {/* Zona de Palpites (Input + Autocomplete) */}
        {!gameOver ? (
          <div className="relative mb-10">
            <input
              type="text"
              placeholder="Digite o nome de um atleta..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-5 py-3 text-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {/* Menu Dropdown do Autocomplete */}
            {filteredOptions.length > 0 && (
              <ul className="absolute z-10 w-full bg-slate-800 border border-slate-700 mt-2 rounded-xl max-h-60 overflow-y-auto shadow-2xl divide-y divide-slate-700">
                {filteredOptions.map((athlete) => (
                  <li
                    key={athlete.id}
                    onClick={() => handleSelectAthlete(athlete.id)}
                    className="px-5 py-3 hover:bg-slate-700 cursor-pointer transition-colors font-medium"
                  >
                    {athlete.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="text-center bg-slate-800 border border-emerald-500/30 p-6 rounded-2xl mb-10 animate-bounce">
            <h2 className="text-2xl font-bold text-emerald-400">🎉 Parabéns! Você acertou!</h2>
            <p className="text-slate-300 mt-1">Volte amanhã para um novo desafio.</p>
          </div>
        )}

        {/* Tabela de Tentativas (Grid Dinâmico com Tailwind) */}
        <div className="space-y-3">
          {guesses.length > 0 && (
            <div className="grid grid-cols-5 text-center font-bold text-sm text-slate-400 pb-2 px-2">
              <div>Atleta</div>
              <div>País</div>
              <div>Esporte</div>
              <div>Ano</div>
              <div>Status</div>
            </div>
          )}

          {guesses.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-2 text-center items-center font-semibold text-sm bg-slate-950/40 p-1 rounded-xl"
            >
              {/* Nome do Atleta */}
              <div className="bg-slate-800 p-3 rounded-lg text-left overflow-hidden text-ellipsis whitespace-nowrap pl-4">
                {item.guess.name}
              </div>

              {/* País */}
              <div
                className={`p-3 rounded-lg text-white transition-all ${
                  item.comparison.country ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {item.guess.country}
              </div>

              {/* Esporte */}
              <div
                className={`p-3 rounded-lg text-white transition-all ${
                  item.comparison.sport ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {item.guess.sport}
              </div>

              {/* Ano de Nascimento (Com setas indicativas) */}
              <div
                className={`p-3 rounded-lg text-white transition-all flex items-center justify-center gap-1 ${
                  item.comparison.birth_year === 'equal' ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {item.guess.birth_year}
                {item.comparison.birth_year === 'higher' && '⬆️'}
                {item.comparison.birth_year === 'lower' && '⬇️'}
              </div>

              {/* Status Aposentado */}
              <div
                className={`p-3 rounded-lg text-white transition-all ${
                  item.comparison.is_retired ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              >
                {item.guess.is_retired ? 'Aposentado' : 'Ativo'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}