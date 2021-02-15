import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router'
import { CSSTransition } from 'react-transition-group'
import io from 'socket.io-client';
import styles from '../styles/connectfour.module.css';
import { Square, Board, calculateWinner } from './connectfour';


const socket = io();

export default function ConnectFourInteractive() {

  const router = useRouter();
  const [inProp, setInProp] = useState(true);
  const [name, setName] = useState('');
  const [opponentName, setOpponentName] = useState('');
	const [columns, setColumns] = useState([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
	const [moves, setMoves] = useState(0);
	const [next, setNext] = useState('red');
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
			setPlayer(number === 0 ? 'red' : 'yellow');
      setOpponentName(opponent);      
		});
		socket.on('opponentmove', (i) => {
			opponentMove(i);
		});
		socket.on('startreplay', () => {
			setColumns([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
			setMoves(0);
			setNext('red');
			setPlayer(player == 'red' ? 'yellow' : 'red');
		});
		socket.on('opponentexit', () => {
      setColumns([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
      setMoves(0);
      setNext('red');
			setStep('exiting');
      setPlayer('');
		});
	}, [player, step, next]);

  const exit = (path) => {
    socket.emit('exit', name, code);
    setInProp(false);
    router.prefetch(path);
    setTimeout(() => {router.push(path)}, 500);
  }

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
    socket.emit('move', name, code, i);
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
		socket.emit('replay', code);
  }

  const createGame = () => {
    let gen_code = Math.floor(Math.random() * 5000 + 5000);
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
    const winner = calculateWinner(columns);
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
      status = <div >{next == player ? 'Your' : opponentName + "'s"} turn</div>;
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
        	<div style={{display:'flex'}}>You are&nbsp;{piece}</div>
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
        <title>Connect Four</title>
      </Head>
      <CSSTransition in={inProp} enter={false} unmountOnExit timeout={500} classNames="page">
        <div>
          <div style={{display:'flex'}}>
            <button className="button" onClick={() => exit('/')}>&larr;</button>
          </div>
          <div className="container">
            <h1 style={{fontSize:'60px',fontFamily:'Rajdhani, sans-serif'}}>Connect Four</h1>
            {display}
          </div>
        </div>
      </CSSTransition>
      <CSSTransition in={inProp} enter={false} unmountOnExit timeout={500} classNames="panel-transition">
        <div className="panel"/>
      </CSSTransition>
    </div>
	);
}