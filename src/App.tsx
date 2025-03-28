import { useEffect, useState } from 'react';
import './App.css';

interface Character {
  name: string;
  image: string;
}

function App() {
  const [cards, setCards] = useState<Character[]>([]);
  const [clickedNames, setClickedNames] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const savedScore = localStorage.getItem('bestScore');
    return savedScore ? parseInt(savedScore) : 0;
  });
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStone, setShowStone] = useState(false);

  const shuffle = (arr: Character[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const fetchCharacters = async (count: number) => {
    try {
      const res = await fetch('https://hp-api.onrender.com/api/characters');
      const data = await res.json();
      const selected = data
        .filter((char: any) => char.image && char.name)
        .slice(0, count)
        .map((char: any) => ({
          name: char.name,
          image: char.image,
        }));
      setCards(shuffle(selected));
    } catch (error) {
      console.error('Error fetching Harry Potter characters:', error);
    }
  };

  useEffect(() => {
    fetchCharacters(level === 1 ? 12 : 20);
  }, [level]);

  const handleClick = (name: string) => {
    if (clickedNames.includes(name)) {
      setScore(0);
      setClickedNames([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('bestScore', newScore.toString());
      }
      setClickedNames([...clickedNames, name]);

      // Verificar si completó el nivel
      if (level === 1 && newScore === 12) {
        setShowCelebration(true);
        setShowStone(true);
        setTimeout(() => {
          setShowCelebration(false);
          setShowStone(false);
          setLevel(2);
          setScore(0);
          setClickedNames([]);
          fetchCharacters(20);
        }, 5000);
      }
    }
    setCards(shuffle(cards));
  };

  return (
    <div className="App">
      <h1>⚡ Harry Potter Memory Game</h1>
      <p>Score: {score} | Best Score: {bestScore} | Level: {level}</p>
      {showCelebration && (
        <div className="celebration">
          <h2>¡Felicidades! 🎉</h2>
          <p>¡Has completado el nivel {level}!</p>
          <p>¡Avanzando al siguiente nivel...</p>
        </div>
      )}
      {showStone && (
        <div className="stone-modal">
          <div className="stone-content">
            <h2>¡Has ganado el Trofeo de la Casa! ��</h2>
            <p>¡Eres digno de ser un mago de Hogwarts!</p>
          </div>
        </div>
      )}
      <div className="card-grid">
        {cards.map((char) => (
          <div key={char.name} className="card" onClick={() => handleClick(char.name)}>
            <img src={char.image} alt={char.name} />
            <p>{char.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
