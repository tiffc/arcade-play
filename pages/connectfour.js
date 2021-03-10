import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CSSTransition } from 'react-transition-group'
import styles from '../styles/connectfour.module.css'

export function Square(props) {
	const style = { background: props.color };
	const piece = <div className={styles.piece} style={style}></div>;
  return (
    <button className={styles.square} onClick={props.onClick}>
      {piece}
    </button>
  );
}

export class Board extends React.Component {
  renderSquare(i, j) {
  	const color = (this.props.columns[j][i] ? this.props.columns[j][i] : 'rgb(255, 255, 255, 0.5)');
    return (
      <Square
      	key={6*i+j} 
        color={color}
        onClick={() => this.props.onClick(j)}
      />
    );
  }

  renderRow(i) {
  	const rows = [];
  	for (let j = 0; j < 7; j++) {
  		rows.push(this.renderSquare(i, j));
  	}
  	return (
  		<div key={i} className={styles.row}>
  			{rows}
  		</div>
  	);
  }

  render() {
  	const board = []
  	for (let i = 5; i >= 0; i--) {
  		board.push(this.renderRow(i));
  	}
    return (
      <div>
        {board}
      </div>
    );
  }
}

export default function ConnectFour() {

	const router = useRouter();
	const [inProp, setInProp] = useState(true);
	const [columns, setColumns] = useState([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
	const [mode, setMode] = useState();
	const [moves, setMoves] = useState(0);
	const [next, setNext] = useState('red');
	const [player, setPlayer] = useState('red');
	const [display, setDisplay] = useState();
	const [modeButtonStyle, setModeButtonStyle] = useState();
  
  useEffect(() => {
    render();
  }, [columns, mode, player, moves, next]);

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
    setNext('red');
    setPlayer('red');
    setColumns([Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)]);
    setMoves(0);
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
    if (mode == 'singleplayer' && !calculateWinner(new_columns) && moves < 41) {
    	let c = opponentMove(new_columns, moves);
    	j = 0;
	    while (new_columns[c][j]) {
	      j++;
	    }
      new_columns[c][j] = player == 'red' ? 'yellow' : 'red';
      setMoves(moves+2);
    } else {
      setMoves(moves+1);
      setNext(next == 'red' ? 'yellow' : 'red');
    }
    if (mode == 'twoplayer') {
      setPlayer(player == 'red' ? 'yellow' : 'red');
    }
    setColumns(new_columns);
  }

  const replay = () => {
  	const new_columns = [Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null),Array(6).fill(null)];
    setMoves(0);
    if (mode == 'singleplayer' && player == 'red') {
      new_columns[opponentMove(new_columns, moves)][0] = 'red';
      setMoves(1);
      setNext('yellow');
      setPlayer('yellow');
    } else {
      setMoves(0);
      setNext('red');
      setPlayer('red');
    }
    setColumns(new_columns);
  }

  const render = () => {
  	let display;
  	let modeButtonStyle = {display:'none'};
  	if (mode) {
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
					background: (moves % 2 === 0) ? 'red' : 'yellow',
					height: 22,
					width: 22,
					borderRadius: '50%'
				};
				const piece = <div style={style}></div>;
	      status = <div style={{display: 'flex'}}>{piece}&nbsp;turn</div>;
	    }

	    modeButtonStyle = {display:'inline', marginLeft:'auto'};

	    display = (
	    	<div className={styles.game}>
          <Board 
            columns={columns}
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
					<Link href="/connectfour-interactive">
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
        <title>Connect Four</title>
      </Head>
      <CSSTransition in={inProp} appear={true} unmountOnExit timeout={500} classNames="page">
      	<div>
		  		<div style={{'display':'flex'}}>
			    	<button className="button" onClick={() => exit('/')}>&larr;</button>
			      <button className="button" style={modeButtonStyle} onClick={() => changeMode()}>Change mode</button>
		  		</div>
		    	<div className="container">
		    		<h1 style={{fontSize:'60px',fontFamily: 'Rajdhani, sans-serif'}}>Connect Four</h1>
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

export function calculateWinner(columns) {
	for (let j = 0; j < 7; j++) {
		for (let i = 0; i < 3; i++) {
			if (columns[j][i] && columns[j][i] === columns[j][i+1] && columns[j][i] === columns[j][i+2] &&
				columns[j][i] === columns[j][i+3]) {
				return columns[j][i];
			}
		}
	}
	for (let i = 0; i < 6; i++) {
		for (let j = 0; j < 4; j++) {
			if (columns[j][i] && columns[j][i] === columns[j+1][i] && columns[j][i] === columns[j+2][i] && columns[j][i] === columns[j+3][i]) {
				return columns[j][i];
			}
		}
	}
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 4; j++) {
			if (columns[j][i] && columns[j][i] === columns[j+1][i+1] && columns[j][i] === columns[j+2][i+2] && columns[j][i] === columns[j+3][i+3]) {
				return columns[j][i];
			}
		}
	}
	for (let i = 5; i > 2; i--) {
		for (let j = 0; j < 4; j++) {
			if (columns[j][i] && columns[j][i] === columns[j+1][i-1] && columns[j][i] === columns[j+2][i-2] && columns[j][i] === columns[j+3][i-3]) {
				return columns[j][i];
			}
		}
	}
	return null;
}

function opponentMove(columns, moves) {
	let column = Math.floor(Math.random() * 7);
	let value = -22;
	for (let c = 0; c < 7; c++) {
		if (!columns[c][5]) {
			const successor = [];
			for (let k = 0; k < 7; k++) {
				successor.push(columns[k].slice());
			}
			let i = 0;
		  while (successor[c][i]) {
		  	i++;
		  }
		  successor[c][i] = (moves % 2 === 0) ? 'red' : 'yellow';

		  const winner = calculateWinner(successor);
			if (winner === ((moves % 2 === 0) ? 'red' : 'yellow')) {
				column = c;
				break;
			}

  		const v = -miniMax(successor, moves, 7, -22, 22, (moves % 2 === 0) ? 'yellow' : 'red');
  		if (v > value) {
  			column = c;
  			value = v;
  		} else if (v === value && Math.random() < 0.5) {
  			column = c;
  		}
  	}
  }
  return column;
}

function miniMax(state, moves, depth, alpha, beta, player) {
	if (moves === 42 || depth === 0) {
		return 0;
	}

	for (let j = 0; j < 7; j++) {
		if (!state[j][5]) {
			let i = 0;
		  while (state[j][i]) {
		  	i++;
		  }
		  state[j][i] = player;
		  const winner = calculateWinner(state);
			if (winner === player) {
				return Math.floor((43 - moves)/2);
			}
			state[j][i] = null;
		}
	}

	const max = Math.floor((41 - moves)/2);
	if (beta > max) {
		beta = max;
		if (alpha >= beta) {
			return beta;
		}
	}
	
	for (let j = 0; j < 7; j++) {
		if (!state[j][5]) {
			const successor = [];
			for (let k = 0; k < 7; k++) {
				successor.push(state[k].slice());
			}
			let i = 0;
		  while (successor[j][i]) {
		  	i++;
		  }
		  successor[j][i] = player;
			const value = -miniMax(successor, moves+1, depth-1, -beta, -alpha, (player === 'red' ? 'yellow' : 'red'));
			if (value >= beta) {
				return value;
			}
			if (value > alpha) {
				alpha = value;
			}
		}
	}
	return alpha;
}

// function miniMax(state, column, totalMoves, currMoves, depth, alpha, beta, player) {
// 	if (totalMoves === 42) {
// 		return 0;
// 	}

// 	const successor = [];
// 	for (let k = 0; k < 7; k++) {
// 		successor.push(state[k].slice());
// 	}
// 	let i = 0;
//   while (successor[column][i]) {
//   	i++;
//   }
//   successor[column][i] = player;
//   totalMoves++;
//   currMoves++;

// 	const winner = calculateWinner(successor);
// 	if (winner === player) {
// 		return 22 - currMoves;
// 	} else if (winner && winner !== player) {
// 		return totalMoves - currMoves - 22;
// 	} else if (depth === 0) {
// 		return score(successor);
// 	}

// 	if (player === 'yellow') {
// 		return maxValue(successor, totalMoves, currMoves, depth, alpha, beta);
// 	} else {
// 		return minValue(successor, totalMoves, currMoves, depth, alpha, beta);
// 	}
// }

// function minValue(state, totalMoves, currMoves, depth, alpha, beta) {
// 	let value = -22;
// 	for (let j = 0; j < 7; j++) {
// 		if (!state[j][5]) {
// 			const v = -miniMax(state, j, totalMoves, totalMoves-currMoves, depth-1, alpha, beta, 'yellow');
// 			if (v > value) {
// 				value = v;
// 				beta = v;
// 			}
// 			if (value >= alpha) {
// 				break;
// 			}
// 		}
// 	}
// 	return value;
// }

// function maxValue(state, totalMoves, currMoves, depth, alpha, beta) {
// 	let value = -22;
// 	for (let j = 0; j < 7; j++) {
// 		if (!state[j][5]) {
// 			const v = -miniMax(state, j, totalMoves, totalMoves-currMoves, depth-1, alpha, beta, 'red');
// 			if (v > value) {
// 				value = v;
// 				alpha = v;
// 			}
// 			if (value >= beta) {
// 				break;
// 			}
// 		}
// 	}
// 	return value;
// }

// function score(state) {
// 	let score = 0;
// 	let centerCount = 0;
// 	for (let i = 0; i < 6; i++) {
// 		if (state[3][i] === 'yellow') {
// 			centerCount++;
// 		}
// 	}
// 	score += centerCount*3;
// 	let line;
// 	for (let j = 0; j < 7; j++) {
// 		line = [];
// 		for (let i = 0; i < 3; i++) {
// 			for (let k = i; k < i+4; k++) {
// 				line.push(state[j][k]);
// 			}
// 			score += lineScore(line);
// 		}
// 	}
// 	for (let i = 0; i < 6; i++) {
// 		line = [];
// 		for (let j = 0; j < 4; j++) {
// 			for (let k = j; k < j+4; k++) {
// 				line.push(state[k][i]);
// 			}
// 			score += lineScore(line);
// 		}
// 	}
// 	for (let i = 0; i < 3; i++) {
// 		line = [];
// 		for (let j = 0; j < 4; j++) {
// 			for (let k = 0; k < 4; k++) {
// 				line.push(state[j][i+k]);
// 			}
// 			score += lineScore(line);
// 		}
// 	}
// 	for (let i = 5; i > 2; i--) {
// 		line = [];
// 		for (let j = 0; j < 4; j++) {
// 			for (let k = 0; k < 4; k++) {
// 				line.push(state[j][i-k]);
// 			}
// 			score += lineScore(line);
// 		}
// 	}
// 	return score;
// }

// function lineScore(line) {
// 	let redCount, yellowCount, nullCount;
// 	for (let player of line) {
// 		if (player === 'red') {
// 			redCount++;
// 		} else if (player === 'yellow') {
// 			yellowCount++;
// 		} else {
// 			nullCount++;
// 		}
// 	}
// 	let score = 0;
// 	if (yellowCount === 3 && nullCount === 1) {
// 		score += 5;
// 	} else if (yellowCount === 2 && nullCount === 2) {
// 		score += 2;
// 	} 
// 	if (redCount === 3 && nullCount === 1) {
// 		score -= 6;
// 	} 
// 	return score;
// }