"use client";

import React, { useState } from "react";

const CoinToss: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [nader, setNader] = useState<string>("nader");

  const coinToss = () => {
    setNader("");
    const flipResult = Math.random() < 0.5 ? "heads" : "tails";
    setResult(flipResult);
    console.log(flipResult);
  };

  return (
    <div className="App">
      <div id="coin" className={result} key={Date.now()}>
        <div className="side-a">
          <h2>TAIL</h2>
        </div>
        <div className="side-b">
          <h2>HEAD</h2>
        </div>
      </div>
      <h1>Flip a coin</h1>
      <button id="btn" onClick={coinToss}>
        Coin Toss
      </button>
    </div>
  );
};

export default CoinToss;