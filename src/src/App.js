import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import GameOver from './components/GameOver';
import { createContext, useEffect, useState } from "react"
import { boardDefault, generateWordSet } from './Words'

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault)
  const [currentAttempt, setCurrentAttempt] = useState({attempt: 0, letterPosition: 0})
  const [wordSet, setWordSet] = useState(new Set())
  const [correctWord, setCorrectWord] = useState("");
  const [disabledLetters, setDisabledLetters] = useState([])
  const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false})

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet)
      console.log(words.todaysWord)
      setCorrectWord(words.todaysWord.toUpperCase())
    });
  }, []);

  const onSelectLetter = (keyValue) => {
    if (currentAttempt.letterPosition > 4 || currentAttempt.attempt > 5) return;
    const newboard = [...board]
    newboard[currentAttempt.attempt][currentAttempt.letterPosition] = keyValue
    setBoard(newboard);
    setCurrentAttempt({...currentAttempt, letterPosition: currentAttempt.letterPosition+1})
  };

  const onDelete = () => {
    if (currentAttempt.letterPosition === 0 || currentAttempt.attempt > 5) return;
    const newboard = [...board]
    newboard[currentAttempt.attempt][currentAttempt.letterPosition-1] = ""
    setBoard(newboard)
    setCurrentAttempt({...currentAttempt, letterPosition: currentAttempt.letterPosition-1})
  };

  const onEnter = () => {
    if (currentAttempt.letterPosition !== 5 || currentAttempt.attempt > 5) return;
    let currentWord = ""
    for (let i = 0; i < 5; i++) {
      currentWord += board[currentAttempt.attempt][i]
    }
    if (wordSet.has(currentWord.toLowerCase())){
      setCurrentAttempt({attempt: currentAttempt.attempt + 1, letterPosition: 0})
    } else {
      alert("Word not found")
    }

    if (currentWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currentAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
  };

  return (
    <div className="App">
      <nav>
        <h1>Infinite Wordle</h1>
      </nav>
      <AppContext.Provider value={{board, setBoard, currentAttempt, setCurrentAttempt, onSelectLetter, onDelete, 
        onEnter, correctWord, disabledLetters, setDisabledLetters, gameOver, setGameOver}}>
        <div className='game'>
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
