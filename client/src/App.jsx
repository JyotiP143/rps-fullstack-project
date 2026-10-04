import { useEffect, useState } from "react";
import "./App.css";

const choices = [
  {
    name: "rock",
    emoji: "✊",
  },
  {
    name: "paper",
    emoji: "✋",
  },
  {
    name: "scissors",
    emoji: "✌️",
  },
];

function App() {
  const [playerName, setPlayerName] = useState("");
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Choose your move!");
  const [leaderboard, setLeaderboard] = useState([]);

  const API_URL = "http://localhost:5000/api/games";

  // Get leaderboard
  const getLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      const data = await response.json();

      setLeaderboard(data);
    } catch (error) {
      console.log("Leaderboard error:", error);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  // Generate computer choice
  const getComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);

    return choices[randomIndex].name;
  };

  // Check winner
  const getWinner = (player, computer) => {
    if (player === computer) {
      return "draw";
    }

    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }

    return "lose";
  };

  // Play game
  const playGame = async (choice) => {
    if (!playerName.trim()) {
      setMessage("Please enter your name first.");
      return;
    }

    const computer = getComputerChoice();
    const gameResult = getWinner(choice, computer);

    let roundScore = 0;
    let resultMessage = "";

    if (gameResult === "win") {
      roundScore = 1;
      resultMessage = "🎉 You Win!";
    } else if (gameResult === "lose") {
      roundScore = 0;
      resultMessage = "😢 You Lose!";
    } else {
      roundScore = 0;
      resultMessage = "🤝 It's a Draw!";
    }

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);
    setMessage(resultMessage);

    if (gameResult === "win") {
      setScore((previousScore) => previousScore + 1);
    }

    try {
      await fetch(`${API_URL}/play`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName,
          playerChoice: choice,
          computerChoice: computer,
          result: gameResult,
          score: roundScore,
        }),
      });

      getLeaderboard();
    } catch (error) {
      console.log("Save game error:", error);
    }
  };

  const getEmoji = (choice) => {
    const selectedChoice = choices.find(
      (item) => item.name === choice
    );

    return selectedChoice ? selectedChoice.emoji : "❓";
  };

  const resetGame = () => {
    setPlayerChoice("");
    setComputerChoice("");
    setResult("");
    setScore(0);
    setMessage("Choose your move!");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          🎮 RPS Arena
        </div>

        <div className="nav-text">
          React + Node + MongoDB
        </div>
      </header>

      <main className="container">

        <section className="hero">
          <p className="badge">FULL STACK GAME</p>

          <h1>
            Rock Paper
            <span> Scissors</span>
          </h1>

          <p>
            Challenge the computer and climb the leaderboard.
          </p>
        </section>

        <section className="game-layout">

          <div className="game-card">

            <div className="player-input">
              <label>Your Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) =>
                  setPlayerName(e.target.value)
                }
              />
            </div>

            <div className="score-box">
              <div>
                <small>Your Score</small>
                <strong>{score}</strong>
              </div>

              <div>
                <small>Result</small>
                <strong className={`result ${result}`}>
                  {result || "-"}
                </strong>
              </div>
            </div>

            <div className="battle">

              <div className="player-choice">
                <span>You</span>

                <div className="choice-display">
                  {getEmoji(playerChoice)}
                </div>
              </div>

              <div className="vs">
                VS
              </div>

              <div className="player-choice">
                <span>Computer</span>

                <div className="choice-display">
                  {getEmoji(computerChoice)}
                </div>
              </div>

            </div>

            <div className="message">
              {message}
            </div>

            <div className="choices">

              {choices.map((choice) => (
                <button
                  key={choice.name}
                  className="choice-button"
                  onClick={() =>
                    playGame(choice.name)
                  }
                >
                  <span>{choice.emoji}</span>
                  {choice.name}
                </button>
              ))}

            </div>

            <button
              className="reset-button"
              onClick={resetGame}
            >
              Reset Game
            </button>

          </div>

          <aside className="leaderboard">

            <div className="leaderboard-header">
              <div>
                <p>TOP PLAYERS</p>
                <h2>Leaderboard</h2>
              </div>

              <span>🏆</span>
            </div>

            {leaderboard.length === 0 ? (
              <div className="empty">
                No games played yet.
              </div>
            ) : (
              <div className="players">

                {leaderboard.map((player, index) => (
                  <div
                    className="leader-row"
                    key={player._id}
                  >
                    <div className="rank">
                      #{index + 1}
                    </div>

                    <div className="player-info">
                      <strong>
                        {player._id}
                      </strong>

                      <small>
                        {player.gamesPlayed} games
                      </small>
                    </div>

                    <div className="points">
                      {player.totalScore}
                    </div>
                  </div>
                ))}

              </div>
            )}

          </aside>

        </section>

        <section className="features">

          <div>
            <span>⚡</span>
            <h3>Fast Gameplay</h3>
            <p>Simple and quick game experience.</p>
          </div>

          <div>
            <span>💾</span>
            <h3>MongoDB</h3>
            <p>Game results are stored in database.</p>
          </div>

          <div>
            <span>📱</span>
            <h3>Responsive</h3>
            <p>Works on mobile, tablet and desktop.</p>
          </div>

        </section>

      </main>

      <footer>
        Built with React, Node.js, Express & MongoDB
      </footer>
    </div>
  );
}

export default App;