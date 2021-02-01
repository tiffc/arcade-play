import React from 'react'
import Link from 'next/link'
import styles from '../styles/connectfour.module.css'

function Square(props) {
	const style = { background: props.color };
	const piece = <div className={styles.piece} style={style}></div>;
  return (
    <button className={styles.square} onClick={props.onClick}>
      {piece}
    </button>
  );
}

class Board extends React.Component {
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

class ConnectFour extends React.Component {
  constructor(props) {
    super(props);
    const columns = [];
    for (let j = 0; j < 7; j++) {
    	columns.push(Array(6).fill(null));
    }
    this.state = {
    	mode: null,
    	player: 'red',
      columns: columns,
      moves: 0
    };
  }

  selectMode(mode) {
  	this.setState({
  		mode: mode
  	});
  }

  changeMode(mode) {
  	const columns = [];
    for (let j = 0; j < 7; j++) {
    	columns.push(Array(6).fill(null));
    }
  	this.setState({
  		mode: null,
  		columns: columns,
  		moves: 0
  	});
  }

  handleClick(j) {
  	const columns = [];
  	for (let k = 0; k < 7; k++) {
    	columns.push(this.state.columns[k].slice());
    }
    if (calculateWinner(columns) || columns[j][5]) {
      return;
    }
    let i = 0;
    while (columns[j][i]) {
    	i++;
    }
    columns[j][i] = (this.state.moves % 2 === 0) ? 'red' : 'yellow';
    let moves = this.state.moves+1;
    if (this.state.mode === 'singleplayer' && !calculateWinner(columns) && moves < 42) {
    	const column = opponentMove(columns, moves);
    	let i = 0;
    	while (columns[column][i]) {
	    	i++;
	    }
    	columns[column][i] = (moves % 2 === 0) ? 'red' : 'yellow';
    	moves++;
    }
    this.setState({
      columns: columns,
      moves: moves
    });
  }

  replay() {
  	let player = 'red';
  	const columns = [];
  	let moves = 0;
    for (let j = 0; j < 7; j++) {
    	columns.push(Array(6).fill(null));
    }
    if (this.state.mode === 'singleplayer' && calculateWinner(this.state.columns) === this.state.player) {
  		columns[3][0] = 'red';
  		moves++;
  		player = 'yellow';
  	}
  	this.setState({
  		player: player,
  		columns: columns,
  		moves: moves
  	});
  }

  render() {
  	let display, top;
  	if (this.state.mode) {
	    const winner = calculateWinner(this.state.columns);

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
	      	<div style={{minWidth: '115px'}}>
	      		<div style={{display: 'flex'}}>{piece}<b>&nbsp;wins!</b></div>
	      		<br/>
	      		<br/>
	      		<br/>
	      		<button className="button" onClick={() => this.replay()}>Play again</button>
	      	</div>
	      );
	    } else if (this.state.moves === 42) {
	    	status = (
	      	<div style={{minWidth: '115px'}}>
	      		<b>Draw!</b>
	      		<br/>
	      		<br/>
	      		<br/>
	      		<button className="button" onClick={() => this.replay()}>Play again</button>
	      	</div>
	      );
	    } else {
	    	const style = { 
					background: (this.state.moves % 2 === 0) ? 'red' : 'yellow',
					height: 22,
					width: 22,
					borderRadius: '50%'
				};
				const piece = <div style={style}></div>;
	      status = <div style={{display: 'flex', minWidth: '115px'}}>{piece}&nbsp;turn</div>;
	    }

	    top = (
	    	<div style={{'display':'flex'}}>
		    	<Link href="/">
		    		<a className="button">&larr;</a>
		      </Link>
	  			<button className="button" style={{marginLeft:'auto'}} onClick={() => this.changeMode()}>Change mode</button>
	  		</div>
  		);

  		display = (
	    	<div className={styles.game}>
          <Board 
            columns={this.state.columns}
            onClick={(j) => this.handleClick(j)}
          />
	        <div className={styles.gameinfo}>
	          {status}
	        </div>
	      </div>
	    );
	  } else {
	  	top = (
				<div style={{display:'flex'}}>
		    	<Link href="/">
		    		<a className="button">&larr;</a>
		      </Link>
		    </div>
  		);

			display = (
				<div className="mode">
					<h3>Game Mode</h3>
					<button className="button" onClick={() => this.selectMode('singleplayer')}>Single player</button>
					<br/>
					<br/>
					<button className="button" onClick={() => this.selectMode('twoplayer')}>Two player</button>
				</div>
			);
	  }

    return (
    	<div>
	    	<div className="stars"></div>
	    	<div className="twinkling"></div>
	  		{top}
	    	<div className="container">
	    		<h1 style={{fontSize:'48px'}}>Connect Four</h1>
	    		{display}
				</div>
			</div>
    );
  }
}

export default ConnectFour

// ========================================

function calculateWinner(columns) {
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

function score(state) {
	let score = 0;
	let centerCount = 0;
	for (let i = 0; i < 6; i++) {
		if (state[3][i] === 'yellow') {
			centerCount++;
		}
	}
	score += centerCount*3;
	let line;
	for (let j = 0; j < 7; j++) {
		line = [];
		for (let i = 0; i < 3; i++) {
			for (let k = i; k < i+4; k++) {
				line.push(state[j][k]);
			}
			score += lineScore(line);
		}
	}
	for (let i = 0; i < 6; i++) {
		line = [];
		for (let j = 0; j < 4; j++) {
			for (let k = j; k < j+4; k++) {
				line.push(state[k][i]);
			}
			score += lineScore(line);
		}
	}
	for (let i = 0; i < 3; i++) {
		line = [];
		for (let j = 0; j < 4; j++) {
			for (let k = 0; k < 4; k++) {
				line.push(state[j][i+k]);
			}
			score += lineScore(line);
		}
	}
	for (let i = 5; i > 2; i--) {
		line = [];
		for (let j = 0; j < 4; j++) {
			for (let k = 0; k < 4; k++) {
				line.push(state[j][i-k]);
			}
			score += lineScore(line);
		}
	}
	return score;
}

function lineScore(line) {
	let redCount, yellowCount, nullCount;
	for (let player of line) {
		if (player === 'red') {
			redCount++;
		} else if (player === 'yellow') {
			yellowCount++;
		} else {
			nullCount++;
		}
	}
	let score = 0;
	if (yellowCount === 3 && nullCount === 1) {
		score += 5;
	} else if (yellowCount === 2 && nullCount === 2) {
		score += 2;
	} 
	if (redCount === 3 && nullCount === 1) {
		score -= 6;
	} 
	return score;
}