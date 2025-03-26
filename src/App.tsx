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
  const [bestScore, setBestScore] = useState(0);

  const shuffle = (arr: Character[]) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const fetchCharacters = async () => {
    try {
      const res = await fetch('https://hp-api.onrender.com/api/characters');
      const data = await res.json();
      const selected = data
        .filter((char: any) => char.image && char.name)
        .slice(0, 12)
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
    fetchCharacters();
  }, []);

  const handleClick = (name: string) => {
    if (clickedNames.includes(name)) {
      setScore(0);
      setClickedNames([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
      setClickedNames([...clickedNames, name]);
    }
    setCards(shuffle(cards));
  };

  return (
    <div className="App">
      <h1>⚡ Harry Potter Memory Game</h1>
      <p>Score: {score} | Best Score: {bestScore}</p>
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
