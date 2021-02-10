import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import styles from '../styles/tictactoe.module.css';
import { Square, Board, calculateWinner } from './tictactoe';


const socket = io();

export default function TicTacToeInteractive() {

	const [squares, setSquares] = useState(Array(9).fill(null));
	const [moves, setMoves] = useState(0);
	const [next, setNext] = useState('X');
	const [player, setPlayer] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState('');
	const [display, setDisplay] = useState();

	useEffect(() => {
		socket.on('start', (player) => {
			setPlayer(player);
		});
		socket.on('move', (i) => {
			opponentMove(i);
		});
		socket.on('replay', () => {
			setSquares(Array(9).fill(null));
			setMoves(0);
			setNext('X');
			setPlayer(player == 'X' ? 'O' : 'X');
		});
		render();
	}, [socket, step, code, squares, player, moves, next]);

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i] || next != player) {
      return;
    }
    const new_squares = squares.slice();
    new_squares[i] = player;
    setSquares(new_squares);
    setMoves(moves+1);
    setNext(player == 'X' ? 'O' : 'X');
    socket.emit('move', i);
  }

  const opponentMove = (i) => {
  	const new_squares = squares.slice();
  	new_squares[i] = player == 'X' ? 'O' : 'X';
  	setSquares(new_squares);
  	setMoves(moves+1);
    setNext(player == 'X' ? 'X' : 'O');
  }

  const replay = () => {
  	setSquares(Array(9).fill(null));
		setMoves(0);
		setNext('X');
		setPlayer(player == 'X' ? 'O' : 'X');
		socket.emit('replay');
  }

  const createGame = () => {
    let code = 0;
    for (let i = 0; i < 4; i++) {
      code = (code * 10) + Math.floor(Math.random() * 10);
    }
    socket.emit('game', code.toString());
    setCode(code);
    setStep('waiting');
  }

  const joinGame = () => {
    setStep('joining');
  }

  const codeSubmit = (event) => {
  	if (event) {
  		event.preventDefault();
  	}
    socket.emit('game', code);
    setStep('waiting');
  }

  const exit = () => {
  	socket.emit('exit');
  	socket.disconnect();
  }

	const render = () => {
		let display;
    if (player) {
      const winner = calculateWinner(squares);
      let status;
      if (winner) {
        status = (
          <div>
            <b><span style={{fontSize:'24px',fontFamily:'Indie Flower, cursive'}}><b>{winner}</b></span> wins!</b>
            <br/>
            <br/>
            <br/>
            <button className="button" onClick={() => replay()}>Play again</button>
          </div>
        );
      } else if (moves === 9) {
        status = (
          <div>
            <b>Draw!</b>
            <br/>
            <br/>
            <br/>
            <button className="button" onClick={() => replay()}>Play again</button>
          </div>
        );
      } else {
        status = <div><span style={{fontSize:'24px',fontFamily:'Indie Flower, cursive'}}><b>{next}</b></span> turn</div>;
      }

      display = (
        <div className={styles.game}>
          <Board 
            squares={squares}
            onClick={(i) => handleClick(i)}
          />
          <div className={styles.gameinfo}>
          	You are player <span style={{fontSize:'24px',fontFamily:'Indie Flower, cursive'}}><b>{player}</b></span>
          	<br/>
          	<br/>
            {status}
          </div>
        </div>
      );
    } else if (step == 'waiting') {
      display = (
        <div className="mode">
          <h3>Game code: {code}</h3>
          <br/>
          <p>Waiting for second player...</p>
          <br/>
        </div>
      );
    } else if (step == 'joining') {
      display = (
        <div className="mode">
          <form onSubmit={(event) => codeSubmit(event)}>
            <label>
              <h3>Enter code</h3>
              <input className={styles.box} value={code} onInput={(event) => setCode(event.target.value)} />
            </label>
          </form>
          <br/>
          <br/>
          <button className="button" onClick={() => {setStep('')}}>&larr;</button>&nbsp;
          <button className="button" onClick={() => codeSubmit()}>Start game</button>
        </div>
      );
    } else {
      display = (
        <div className="mode">
          <h3>Interactive game mode</h3>
          <button className="button" onClick={() => createGame()}>Create game</button>
          <br/>
          <br/>
          <button className="button" onClick={() => joinGame()}>Enter code</button>
          <br/>
        </div>
      );
    }
    setDisplay(display);
  }

	return (
		<div>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div style={{display:'flex'}}>
        <Link href="/">
          <a className="button" onClick={() => exit()}>&larr;</a>
        </Link>
      </div>
      <div className="container">
        <h1 style={{fontSize:'60px',fontFamily:'Indie Flower, cursive'}}>Tic-Tac-Toe</h1>
        {display}
      </div>
    </div>
	);
}