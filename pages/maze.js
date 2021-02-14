import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CSSTransition } from 'react-transition-group'
import styles from '../styles/maze.module.css'

function Square(props) {
	let background = 'none';
	if (props.current) {
		background = 'rgb(70, 130, 180)';
	} else if (props.properties[4]) {
		background = 'rgb(70, 130, 180, 0.75)';
	}
	const size = (480 / props.size) + 'px';
	const style = {
		borderRight: props.properties[0] ? '1px solid white' : 'none',
		borderBottom: props.properties[1] ? '1px solid white' : 'none',
		borderLeft: props.properties[2] ? '1px solid white' : 'none',
		borderTop: props.properties[3] ? '1px solid white' : 'none',
		background: background,
		width: size,
		height: size
	};
  return (
    <div className={styles.square} style={style}></div>
  );
}

class Maze extends React.Component {
	renderSquare(i, j) {
		let current = false;
		if (this.props.currX === i && this.props.currY === j) {
			current = true;
		}
    return (
      <Square
      	key={this.props.size*i+j}
      	properties={this.props.squares[i][j]}
      	size={this.props.size}
      	current={current}
      />
    );
  }

	renderRow(i) {
  	const rows = [];
  	for (let j = 0; j < this.props.size; j++) {
  		rows.push(this.renderSquare(i, j));
  	}
  	return (
  		<div key={i} className={styles.row}>
  			{rows}
  		</div>
  	);
  }

	render() {
  	const maze = []
  	for (let i = 0; i < this.props.size; i++) {
  		maze.push(this.renderRow(i));
  	}
    return (
      <div>
        {maze}
      </div>
    );
  }
}

export default function MazeGame() {

	const router = useRouter();
	const [inProp, setInProp] = useState(true);
	const [size, setSize] = useState();
	const [squares, setSquares] = useState();
	const [startX, setStartX] = useState();
	const [endX, setEndX] = useState();
	const [currX, setCurrX] = useState();
	const [currY, setCurrY] = useState();
	const [history, setHistory] = useState([]);

	const exit = (path) => {
    setInProp(false);
    setTimeout(() => {router.push(path)}, 500);
  }

  const newSquares = (s) => {
  	const new_squares = [];
    for (let i = 0; i < s; i++) {
    	const row = [];
    	for (let j = 0; j < s; j++) {
    		row.push([0,0,0,0,0]);
    	}
    	new_squares.push(row);
    }
    return new_squares;
  }

  const selectSize = (size) => {
  	const new_squares = newSquares(size);
    const sX = Math.floor(Math.random() * size);
		const eX = Math.floor(Math.random() * size);
    createMaze(new_squares, sX, 0, eX, size-1);
    setSize(size);
    setSquares(new_squares);
    setStartX(sX);
    setEndX(eX);
  }

  const changeSize = (size) => {
  	selectSize(size);
  	setCurrX(null);
  	setCurrY(null);
  	setHistory([]);
  }

  const copySquares = () => {
  	const new_squares = [];
		for (let i = 0; i < size; i++) {
  		let row = [];
  		for (let j = 0; j < size; j++) {
  			row.push(squares[i][j].slice());
  		}
  		new_squares.push(row);
  	}
  	return new_squares;
  }

  const handleKey = (event) => {
  	if (currX != endX || currY != size-1) {
  		const new_squares = copySquares();
	  	const new_history = history.slice();
	  	if (event.keyCode === 37 && currY-1 >= 0 && !squares[currX][currY][2]) {
	  		if (history[history.length-1] === 0) {
	  			new_squares[currX][currY][4] = 0;
	  			new_history.pop();
	  		} else {
	  			new_history.push(2);
	  		}
	  		new_squares[currX][currY-1][4] = 1;
	  		setCurrY(currY-1);
	  	} else if (event.keyCode === 38 && currX-1 >= 0 && !squares[currX][currY][3]) {
	  		if (history.length && history[history.length-1] === 1) {
	  			new_squares[currX][currY][4] = 0;
	  			new_history.pop();
	  		} else {
	  			new_history.push(3);
	  		}
	  		new_squares[currX-1][currY][4] = 1;
	  		setCurrX(currX-1);
	  	} else if (event.keyCode === 39 && currY+1 < size && !squares[currX][currY][0]) {
	  		if (history.length && history[history.length-1] === 2) {
	  			new_squares[currX][currY][4] = 0;
	  			new_history.pop();
	  		} else {
	  			new_history.push(0);
	  		}
	  		new_squares[currX][currY+1][4] = 1;
	  		setCurrY(currY+1);
	  	} else if (event.keyCode === 40 && currX+1 < size && !squares[currX][currY][1]) {
	  		if (history.length && history[history.length-1] === 3) {
	  			new_squares[currX][currY][4] = 0;
	  			new_history.pop();
	  		} else {
	  			new_history.push(1);
	  		}
	  		new_squares[currX+1][currY][4] = 1;
	  		setCurrX(currX+1);
	  	}
	  	setSquares(new_squares);
	  	setHistory(new_history);
	  }
  }

  const start = () => {
  	const new_squares = copySquares();
    new_squares[startX][0][4] = 1;
    setSquares(new_squares);
    setCurrX(startX);
    setCurrY(0);
  }

  const restart = () => {
  	const new_squares = [];
  	for (let i = 0; i < size; i++) {
    	const row = [];
    	for (let j = 0; j < size; j++) {
    		row.push(squares[i][j].slice());
    		row[j][4] = 0;
    	}
    	new_squares.push(row);
    }
    new_squares[startX][0][4] = 1;
    setSquares(new_squares);
    setCurrX(startX);
    setCurrY(0);
  }

  const replay = () => {
  	const new_squares = newSquares(size);
    const sX = Math.floor(Math.random() * size);
		const eX = Math.floor(Math.random() * size);
    createMaze(new_squares, sX, 0, eX, size-1);
    setSquares(new_squares);
    setStartX(sX);
    setEndX(eX);
    setCurrX(null);
    setCurrY(null);
    setHistory([]);
  }

	let display;
	let modeButtonStyle = {display:'none'};
	if (size) {
		let status = <button className="button" onClick={() => start()}>Start</button>;
		if (currX === endX && currY === size-1) {
			status = (
				<div>
					<b>Finish!</b>
	    		<br/>
	    		<br/>
	    		<br/>
	    		<button className="button" onClick={() => replay()}>Play again</button>
				</div>
			);
		} else if (currX != null && currY != null) {
			status = <button className="button" onClick={() => restart()}>Start over</button>;
		}
		
		modeButtonStyle = {display:'inline', marginLeft:'auto'};

		display = (
    	<div tabIndex="0" onKeyDown={(event) => handleKey(event)} className={styles.game}>
        <Maze 
        	size={size}
          squares={squares}
      		currX={currX}
      		currY={currY}
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
				<button className="button" onClick={() => selectSize(20)}>20 x 20</button>
				<br/>
				<br/>
				<button className="button" onClick={() => selectSize(30)}>30 x 30</button>
				<br/>
				<br/>
				<button className="button" onClick={() => selectSize(50)}>50 x 50</button>
			</div>
		);
	}

	return (
		<div>
			<Head>
        <title>Maze</title>
      </Head>
      <CSSTransition in={inProp} appear={true} unmountOnExit timeout={500} classNames="page">
      	<div>
		    	<div style={{'display':'flex'}}>
			    	<button className="button" onClick={() => exit('/')}>&larr;</button>
		  			<button className="button" style={modeButtonStyle} onClick={() => changeSize()}>Change mode</button>
		  		</div>
	        <div className="container">
	          <h1 style={{fontSize:'48px',fontFamily:'Josefin Slab, serif'}}>Maze</h1>
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

function createMaze(maze, startX, startY, endX, endY) {
	const N = maze.length;
	// create maze left and right border
	for (let x = 0; x < N; x++) {
		if (x != startX) {
			maze[x][0][2] = 1;
		}
		if (x != endX) {
			maze[x][N-1][0] = 1;
		}
	}

	// create maze top and bottom border
	for (let y = 0; y < N; y++) {
		maze[0][y][3] = 1;
		maze[N-1][y][1] = 1;
	}

	const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
	const visited = new Set();
	const stack = [[startX, startY, 0]];
	while (stack.length) {
		let [x, y, d] = stack.pop();
		if (visited.has(N*x+y)) {
			continue;
		}
		visited.add(N*x+y);
		if (x == endX && y == endY) {
			continue;
		}
		let i = Math.floor(Math.random() * 4);
		for (let j = 0; j < 4; j++) {
			let new_d = (i+j)%4;
			if (new_d != (d+2)%4) {
				let [dx, dy] = directions[new_d];
				if (x+dx >= 0 && x+dx < N && y+dy >= 0 && y+dy < N && !maze[x][y][new_d]) {
					if (!visited.has(N*(x+dx)+(y+dy))) {
						stack.splice(0, 0, [x+dx, y+dy, new_d]);
						let w = (new_d+1)%4;
						if (w != (d+2)%4) {
							maze[x][y][w] = 1;
							let [wx, wy] = directions[w];
							if (x+wx >= 0 && x+wx < N && y+wy >= 0 && y+wy < N) {
								maze[x+wx][y+wy][(w+2)%4] = 1;
							}
						}
						w = (new_d+3)%4;
						if (w != (d+2)%4) {
							maze[x][y][w] = 1;
							let [wx, wy] = directions[w];
							if (x+wx >= 0 && x+wx < N && y+wy >= 0 && y+wy < N) {
								maze[x+wx][y+wy][(w+2)%4] = 1;
							}
						}
					} else {
						maze[x][y][new_d] = 1;
						let [wx, wy] = directions[new_d];
						if (x+wx >= 0 && x+wx < N && y+wy >= 0 && y+wy < N) {
							maze[x+wx][y+wy][(new_d+2)%4] = 1;
						}
					}
				}
			}
		}
	}
}