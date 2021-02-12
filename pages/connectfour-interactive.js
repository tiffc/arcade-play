import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import io from 'socket.io-client';
import styles from '../styles/connectfour.module.css';
import { Square, Board, calculateWinner } from './connectfour';


const socket = io();

export default function ConnectFourInteractive() {

	const [columns, setColumns] = useState([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
	const [moves, setMoves] = useState(0);
	const [next, setNext] = useState('red');
	const [player, setPlayer] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState('');
	const [display, setDisplay] = useState();

	useEffect(() => {
		socket.on('start', (player) => {
			setPlayer(player === 0 ? 'red' : 'yellow');
		});
		socket.on('move', (i) => {
			opponentMove(i);
		});
		socket.on('replay', () => {
			setColumns([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
			setMoves(0);
			setNext('red');
			setPlayer(player == 'red' ? 'yellow' : 'red');
		});
		socket.on('exit', () => {
			setStep('exiting');
		});
		render();
	}, [socket, step, code, columns, player, moves, next]);

  const handleClick = (i) => {
    if (calculateWinner(columns) || columns[i][5] || next != player) {
      return;
    }
    const new_columns = [];
    for (let k = 0; k < 7; k++) {
      new_columns.push(columns[k].slice());
    }
    let j = 0;
    while (new_columns[i][j]) {
      j++;
    }
    new_columns[i][j] = player;
    setColumns(new_columns);
    setMoves(moves+1);
    setNext(player == 'red' ? 'yellow' : 'red');
    socket.emit('move', i);
  }

  const opponentMove = (i) => {
  	const new_columns = [];
    for (let k = 0; k < 7; k++) {
      new_columns.push(columns[k].slice());
    }
    let j = 0;
    while (new_columns[i][j]) {
      j++;
    }
  	new_columns[i][j] = player == 'red' ? 'yellow' : 'red';
  	setColumns(new_columns);
  	setMoves(moves+1);
    setNext(player == 'red' ? 'red' : 'yellow');
  }

  const replay = () => {
  	setColumns([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
		setMoves(0);
		setNext('red');
		setPlayer(player == 'red' ? 'yellow' : 'red');
		socket.emit('replay');
  }

  const createGame = () => {
    let gen_code = Math.floor(Math.random() * 9000 + 1000);
    setCode(gen_code);
    setStep('waiting');
    socket.emit('game', gen_code.toString());
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
      const winner = calculateWinner(columns);
      let status;
      if (winner) {
        const style = { 
          background: winner,
          height: 22,
          width: 22,
          borderRadius: '50%' 
        };
        const piece = <div style={style}></div>;
        status = (
          <div>
            <div style={{display: 'flex'}}>{piece}<b>&nbsp;wins!</b></div>
            <br/>
            <br/>
            <br/>
            <button className="button" onClick={() => replay()}>Play again</button>
          </div>
        );
      } else if (moves === 42) {
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
        const style = { 
          background: next,
          height: 22,
          width: 22,
          borderRadius: '50%'
        };
        const piece = <div style={style}></div>;
        status = <div style={{display: 'flex'}}>{piece}&nbsp;turn</div>;
      }

      const style = { 
        background: player,
        height: 22,
        width: 22,
        borderRadius: '50%'
      };
      const piece = <div style={style}></div>;
      display = (
        <div className={styles.game}>
          <Board 
            columns={columns}
            onClick={(i) => handleClick(i)}
          />
          <div className={styles.gameinfo}>
          	<div style={{display:'flex'}}>You are player&nbsp;{piece}</div>
          	<br/>
          	<br/>
            {status}
          </div>
        </div>
      );
    } else if (step == 'waiting' || step == 'exiting') {
    	let message = "Waiting for second player...";
    	if (step == 'exiting') {
    		message = "Player has left the game. " + message;
    	}
      display = (
        <div className="mode">
          <h3>Game code: {code}</h3>
          <br/>
          <p>{message}</p>
          <br/>
        </div>
      );
    } else if (step == 'joining') {
      display = (
        <div className="mode">
          <form onSubmit={(event) => codeSubmit(event)}>
            <label>
              <h3>Enter code</h3>
              <input value={code} onInput={(event) => setCode(event.target.value)} />
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
          <h3>Interactive Game Mode</h3>
          <br/>
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
      <Head>
        <title>Connect Four</title>
      </Head>
      <div style={{display:'flex'}}>
        <Link href="/">
          <a className="button" onClick={() => exit()}>&larr;</a>
        </Link>
      </div>
      <div className="container">
        <h1 style={{fontSize:'60px',fontFamily:'Rajdhani, sans-serif'}}>Connect Four</h1>
        {display}
      </div>
    </div>
	);
}