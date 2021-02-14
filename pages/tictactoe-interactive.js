import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import io from 'socket.io-client';
import { useRouter } from 'next/router'
import { CSSTransition } from 'react-transition-group'
import styles from '../styles/tictactoe.module.css';
import { Square, Board, calculateWinner } from './tictactoe';

const socket = io();

export default function TicTacToeInteractive() {

	const router = useRouter();
	const [inProp, setInProp] = useState(true);
	const [name, setName] = useState('');
	const [opponentName, setOpponentName] = useState('');
	const [squares, setSquares] = useState(Array(9).fill(null));
	const [moves, setMoves] = useState(0);
	const [next, setNext] = useState('X');
	const [player, setPlayer] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState('name');

	useEffect(() => {
		socket.on('full', () => {
			console.log('full');
			setCode('');
			setStep('full');
		});
		socket.on('start', (number, opponent) => {
			setPlayer(number === 0 ? 'X' : 'O');
			setOpponentName(opponent);
		});
		socket.on('opponentmove', (i) => {
			opponentMove(i);
		});
		socket.on('startreplay', () => {
			setSquares(Array(9).fill(null));
			setMoves(0);
			setNext('X');
			setPlayer(player == 'X' ? 'O' : 'X');
		});
		socket.on('opponentexit', () => {
			setSquares(Array(9).fill(null));
			setMoves(0);
			setNext('X');
			setStep('exiting');
			setPlayer('');
		});
	}, [player, step, next]);

	const exit = (path) => {
		socket.emit('exit', name, code);
    setInProp(false);
    setTimeout(() => {router.push(path)}, 500);
  }

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i] || next != player) {
      return;
    }
    const new_squares = squares.slice();
    new_squares[i] = player;
    setSquares(new_squares);
    setMoves(moves+1);
    setNext(player == 'X' ? 'O' : 'X');
    socket.emit('move', name, code, i);
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
		socket.emit('replay', code);
  }

  const createGame = () => {
    const gen_code = Math.floor(Math.random() * 4000 + 1000);
    setCode(gen_code);
    setStep('waiting');
    socket.emit('game', name, gen_code);
  }

  const joinGame = () => {
    setStep('joining');
  }

  const nameSubmit = (event) => {
  	if (event) {
  		event.preventDefault();
  	}
    setStep(''); 
  }

  const codeSubmit = (event) => {
  	if (event) {
  		event.preventDefault();
  	}
    socket.emit('game', name, code);
    setStep('waiting');
  }

	let display;
  if (player) {
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = (
        <div>
          <b>{winner == player ? 'You win!' : opponentName + ' wins!'}</b>
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
      status = <div>{next == player ? 'Your' : opponentName + "'s"} turn</div>;
    }

    display = (
      <div className={styles.game}>
        <Board 
          squares={squares}
          onClick={(i) => handleClick(i)}
        />
        <div className={styles.gameinfo}>
        	You are <span style={{fontSize:'24px',fontFamily:'Indie Flower, cursive'}}><b>{player}</b></span>
        	<br/>
        	<br/>
          {status}
        </div>
      </div>
    );
  } else if (step == 'name') {
  	display = (
      <div className="mode">
        <form onSubmit={(event) => nameSubmit(event)}>
          <label>
            <h3>Enter your name</h3>
            <input value={name} onInput={(event) => setName(event.target.value)} />
          </label>
        </form>
        <br/>
        <br/>
        <button className="button" onClick={() => nameSubmit()}>&rarr;</button>
      </div>
    );
  } else if (step == 'waiting' || step == 'exiting') {
  	let message = <p>Waiting for second player...</p>;
  	if (step == 'exiting') {
  		message = <div><p>{opponentName} has left the game. </p>{message}</div>;
  	}
    display = (
      <div className="mode">
        <h3>Game code: {code}</h3>
        <br/>
        {message}
        <br/>
      </div>
    );
  } else if (step == 'joining' || step == 'full') {
  	let message = <br/>;
  	if (step == 'full') {
  		message = <p>Game is full. Please enter a different code.</p>
  	}
    display = (
      <div className="mode">
        <form onSubmit={(event) => codeSubmit(event)}>
          <label>
            <h3>Enter code</h3>
            <input value={code} onInput={(event) => setCode(parseInt(event.target.value))} />
          </label>
        </form>
        {message}
        <br/>
        <button className="button" onClick={() => {setStep('')}}>&larr;</button>&nbsp;
        <button className="button" onClick={() => codeSubmit()}>Start game</button>
      </div>
    );
  } else {
    display = (
      <div className="mode">
        <h3>Hello, {name}</h3>
        <button className="button" onClick={() => createGame()}>Create game</button>
        <br/>
        <br/>
        <button className="button" onClick={() => joinGame()}>Enter code</button>
        <br/>
      </div>
    );
  }

	return (
		<div>
			<Head>
        <title>Tic-Tac-Toe</title>
      </Head>
      <CSSTransition in={inProp} enter={false} timeout={500} classNames="page">
        <div>
		      <div style={{display:'flex'}}>
		        <button className="button" onClick={() => exit('/')}>&larr;</button>
		      </div>
		      <div className="container">
		        <h1 style={{fontSize:'60px',fontFamily:'Indie Flower, cursive'}}>Tic-Tac-Toe</h1>
		        {display}
		      </div>
		    </div>
		  </CSSTransition>
      <CSSTransition in={inProp} enter={false} timeout={500} classNames="panel-transition">
        <div className="panel"/>
      </CSSTransition>
    </div>
	);
}
