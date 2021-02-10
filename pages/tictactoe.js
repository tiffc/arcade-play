import React from 'react'
import Link from 'next/link'
import styles from '../styles/tictactoe.module.css'

function Square(props) {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
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

class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      mode: null,
      moves: 0,
      xIsNext: true
    };
  }

  selectMode(mode) {
    this.setState({
      mode: mode
    });
  }

  changeMode(mode) {
    this.setState({
      mode: null,
      player: 'X',
      squares: Array(9).fill(null),
      moves: 0,
      xIsNext: true
    });
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let moves = this.state.moves+1;
    let xIsNext = this.state.xIsNext;
    if (this.state.mode === 'singleplayer' && !calculateWinner(squares) && moves < 9) {
      squares[opponentMove(squares)] = this.state.xIsNext ? 'O' : 'X';
      moves++;
    } else {
      xIsNext = !xIsNext;
    }
    this.setState({
      squares: squares,
      moves: moves,
      xIsNext: xIsNext
    });
  }

  replay() {
    let player = 'X';
    const squares = Array(9).fill(null);
    let moves = 0;
    let xIsNext = 'X';
    if (this.state.mode === 'singleplayer' && calculateWinner(this.state.squares) === this.state.player) {
      squares[opponentMove(squares)] = 'X';
      moves = 1;
      xIsNext = false;
      player = 'O';
    }
    this.setState({
      player: player,
      squares: squares,
      moves: moves,
      xIsNext: xIsNext
    });
  }

  render() {
    let display;
    let modeButtonStyle = {display:'none'};
    if (this.state.mode) {
      const winner = calculateWinner(this.state.squares);

      let status;
      if (winner) {
        status = (
          <div>
            <b><span style={{fontSize:'24px',fontFamily:'Indie Flower, cursive'}}><b>{winner}</b></span> wins!</b>
            <br/>
            <br/>
            <br/>
            <button className="button" onClick={() => this.replay()}>Play again</button>
          </div>
        );
      } else if (this.state.moves === 9) {
        status = (
          <div>
            <b>Draw!</b>
            <br/>
            <br/>
            <br/>
            <button className="button" onClick={() => this.replay()}>Play again</button>
          </div>
        );
      } else {
        status = <div><span style={{fontSize:'24px',fontFamily:'Indie Flower, cursive'}}><b>{this.state.xIsNext ? 'X' : 'O'}</b></span> turn</div>;
      }

      modeButtonStyle = {display:'inline', marginLeft:'auto'};

      display = (
        <div className={styles.game}>
          <Board 
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
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
          <button className="button" onClick={() => this.selectMode('singleplayer')}>Single player</button>
          <br/>
          <br/>
          <button className="button" onClick={() => this.selectMode('twoplayer')}>Two player</button>
          <br/>
          <br/>
          <Link href="/tictactoe-interactive">
            <a className="button">Invite or join a friend</a>
          </Link>
          <br/>
        </div>
      );
    }

    return (
      <div>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div style={{display:'flex'}}>
          <Link href="/">
            <a className="button">&larr;</a>
          </Link>
          <button className="button" style={modeButtonStyle} onClick={() => this.changeMode()}>Change mode</button>
        </div>
        <div className="container">
          <h1 style={{fontSize:'60px', fontFamily: 'Indie Flower, cursive'}}>Tic-Tac-Toe</h1>
          {display}
        </div>
      </div>
    );
  }
}

export {Square, Board, calculateWinner}
export default TicTacToe

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

function calculateWinner(squares) {
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
