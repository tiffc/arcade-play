import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CSSTransition } from 'react-transition-group'
import styles from '../styles/tictactoe.module.css'

export function Square(props) {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(i) {
    const rows = [];
    for (let j = 0; j < 3; j++) {
      rows.push(this.renderSquare(3*i+j));
    }
    return (
      <div key={i} className={styles.row}>
        {rows}
      </div>
    );
  }

  render() {
    const board = []
    for (let i = 0; i < 3; i++) {
      board.push(this.renderRow(i));
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

export default function TicTacToe() {

  const router = useRouter();
  const [inProp, setInProp] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [mode, setMode] = useState();
  const [moves, setMoves] = useState(0);
  const [next, setNext] = useState('X');
  const [player, setPlayer] = useState('X');
  const [display, setDisplay] = useState((
    <div className="mode">
      <h3>Game Mode</h3>
      <button className="button" onClick={() => selectMode('singleplayer')}>Single player</button>
      &nbsp;&nbsp;
      <button className="button" onClick={() => selectMode('twoplayer')}>Two player</button>
      <br/>
      <br/>
      <Link href="/tictactoe-interactive">
        <a className="button">Invite or join a friend</a>
      </Link>
      <br/>
    </div>
  ));
  const [modeButtonStyle, setModeButtonStyle] = useState({display:'none'});

  useEffect(() => {
    render();
  }, [squares, mode, player, moves, next]);

  const exit = (path) => {
    setInProp(false);
    router.prefetch(path);
    setTimeout(() => {router.push(path)}, 500);
  }

  const selectMode = (mode) => {
    setMode(mode);
  }

  const changeMode = (mode) => {
    setMode();
    setNext('X');
    setPlayer('X');
    setSquares(Array(9).fill(null));
    setMoves(0);
  }

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i] || next != player) {
      return;
    }
    const new_squares = squares.slice();
    new_squares[i] = player;
    if (mode == 'singleplayer' && !calculateWinner(new_squares) && moves < 9) {
      new_squares[opponentMove(new_squares)] = player == 'X' ? 'O' : 'X';
      setMoves(moves+2);
    } else {
      setMoves(moves+1);
      setNext(next == 'X' ? 'O' : 'X');
    }
    if (mode == 'twoplayer') {
      setPlayer(player == 'X' ? 'O' : 'X');
    }
    setSquares(new_squares);
  }

  const replay = () => {
    const new_squares = Array(9).fill(null);
    setMoves(0);
    if (mode == 'singleplayer' && player == 'X') {
      new_squares[opponentMove(new_squares)] = 'X';
      setMoves(1);
      setNext('O');
      setPlayer('O');
    } else {
      setMoves(0);
      setNext('X');
      setPlayer('X');
    }
    setSquares(new_squares);
  }

  const render = () => {
    let display;
    let modeButtonStyle = {display:'none'};
    if (mode) {
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

      modeButtonStyle = {display:'inline', marginLeft:'auto'};

      display = (
        <div className={styles.game}>
          <Board 
            squares={squares}
            onClick={(i) => handleClick(i)}
          />
          <div className={styles.gameinfo}>
            {status}
          </div>
        </div>
      );
    } else {
      display = (
        <div className="mode">
          <h3>Game Mode</h3>
          <button className="button" onClick={() => selectMode('singleplayer')}>Single player</button>
          &nbsp;&nbsp;
          <button className="button" onClick={() => selectMode('twoplayer')}>Two player</button>
          <br/>
          <br/>
          <Link href="/tictactoe-interactive">
            <a className="button">Invite or join a friend</a>
          </Link>
          <br/>
        </div>
      );
    }
    setDisplay(display);
    setModeButtonStyle(modeButtonStyle);
  }

  return (
    <div>
      <Head>
        <title>Tic-Tac-Toe</title>
      </Head>
      <CSSTransition in={inProp} appear={true} unmountOnExit timeout={500} classNames="page">
        <div>
          <div style={{display:'flex'}}>
            <button className="button" onClick={() => exit('/')}>&larr;</button>
            <button className="button" style={modeButtonStyle} onClick={() => changeMode()}>Change mode</button>
          </div>
          <div className="container">
            <h1 style={{fontSize:'60px', fontFamily: 'Indie Flower, cursive'}}>Tic-Tac-Toe</h1>
            {display}
          </div>
        </div>
      </CSSTransition>
      <CSSTransition in={inProp} appear={true} unmountOnExit timeout={500} classNames="panel-transition">
        <div className="panel"/>
      </CSSTransition>
    </div>
  );
}

// ========================================

function opponentMove(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && !squares[c]) {
      return c;
    } else if (squares[a] && squares[a] === squares[c] && !squares[b]) {
      return b;
    } else if (squares[b] && squares[b] === squares[c] && !squares[a]) {
      return a;
    }
  }
  let i;
  do {
    i = Math.floor(Math.random() * 9);
  }
  while (squares[i]);
  return i;
}

export function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
