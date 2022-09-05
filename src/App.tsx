import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Components/Canvas";


function App() {
  return (
    <div className="App">
      <header className="App-header">Game Of Life</header>

      <div className="game-of-life-container">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
