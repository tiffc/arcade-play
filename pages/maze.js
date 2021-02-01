import React from 'react'
import Link from 'next/link'
import styles from '../styles/maze.module.css'

function Square(props) {
	let background = 'none';
	if (props.current) {
		background = 'rgb(255, 255, 255, 0.5)';
	} else if (props.properties[4]) {
		background = 'rgb(255, 255, 255, 0.25)';
	}
	const style = {
		borderRight: props.properties[0] ? '1px solid white' : 'none',
		borderBottom: props.properties[1] ? '1px solid white' : 'none',
		borderLeft: props.properties[2] ? '1px solid white' : 'none',
		borderTop: props.properties[3] ? '1px solid white' : 'none',
		background: background
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
      	key={20*i+j}
      	properties={this.props.squares[i][j]}
      	current={current}
      />
    );
  }

	renderRow(i) {
  	const rows = [];
  	for (let j = 0; j < 20; j++) {
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
  	for (let i = 0; i < 20; i++) {
  		maze.push(this.renderRow(i));
  	}
    return (
      <div>
        {maze}
      </div>
    );
  }
}

class MazeGame extends React.Component {
	constructor(props) {
    super(props);
    const squares = [];
    for (let i = 0; i < 20; i++) {
    	const row = [];
    	for (let j = 0; j < 20; j++) {
    		row.push([0,0,0,0,0]);
    	}
    	squares.push(row);
    }
    const startX = Math.floor(Math.random() * 20);
		const startY = 0;
		const endX = Math.floor(Math.random() * 20);
		const endY = 19;
    createMaze(squares, startX, startY, endX, endY);
    this.state = {
      squares: squares,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      currX: null,
      currY: null,
      history: []
    };
  }

  handleKey(event) {
  	if (this.state.currX != this.state.endX || this.state.currY != this.state.endY) {
  		const squares = [];
  		for (let i = 0; i < 20; i++) {
	  		let row = [];
	  		for (let j = 0; j < 20; j++) {
	  			row.push(this.state.squares[i][j].slice());
	  		}
	  		squares.push(row);
	  	}
	  	const history = this.state.history.slice();
	  	let currX = this.state.currX;
	  	let currY = this.state.currY;
	  	// left
	  	if (event.keyCode === 37 && currY-1 >= 0 && !squares[currX][currY][2]) {
	  		if (history[history.length-1] === 0) {
	  			squares[currX][currY][4] = 0;
	  			history.pop();
	  		} else {
	  			history.push(2);
	  		}
	  		currY--;
	  		squares[currX][currY][4] = 1;
	  	}
	  	// up
	  	if (event.keyCode === 38 && currX-1 >= 0 && !squares[currX][currY][3]) {
	  		if (history.length && history[history.length-1] === 1) {
	  			squares[currX][currY][4] = 0;
	  			history.pop();
	  		} else {
	  			history.push(3);
	  		}
	  		currX--;
	  		squares[currX][currY][4] = 1;
	  	}
	  	// right
	  	if (event.keyCode === 39 && currY+1 < 20 && !squares[currX][currY][0]) {
	  		if (history.length && history[history.length-1] === 2) {
	  			squares[currX][currY][4] = 0;
	  			history.pop();
	  		} else {
	  			history.push(0);
	  		}
	  		currY++;
	  		squares[currX][currY][4] = 1;
	  	}
	  	// down
	  	if (event.keyCode === 40 && currX+1 >= 0 && !squares[currX][currY][1]) {
	  		if (history.length && history[history.length-1] === 3) {
	  			squares[currX][currY][4] = 0;
	  			history.pop();
	  		} else {
	  			history.push(1);
	  		}
	  		currX++;
	  		squares[currX][currY][4] = 1;
	  	}
	  	this.setState({
	  		squares: squares,
	  		currX: currX,
	  		currY: currY,
	  		history: history
	  	});
	  }
  }

  start() {
  	const squares = [];
  	for (let i = 0; i < 20; i++) {
    	const row = [];
    	for (let j = 0; j < 20; j++) {
    		row.push(this.state.squares[i][j].slice());
    	}
    	squares.push(row);
    }
    squares[this.state.startX][this.state.startY][4] = 1;
    this.setState({
      squares: squares,
      currX: this.state.startX,
      currY: this.state.startY
    });
  }

  restart() {
  	const squares = [];
  	for (let i = 0; i < 20; i++) {
    	const row = [];
    	for (let j = 0; j < 20; j++) {
    		row.push(this.state.squares[i][j].slice());
    		row[j][4] = 0;
    	}
    	squares.push(row);
    }
    squares[this.state.startX][this.state.startY][4] = 1;
    this.setState({
      squares: squares,
      currX: this.state.startX,
      currY: this.state.startY
    });
  }

  replay() {
  	const squares = [];
    for (let i = 0; i < 20; i++) {
    	const row = [];
    	for (let j = 0; j < 20; j++) {
    		row.push([0,0,0,0,0]);
    	}
    	squares.push(row);
    }
    const startX = Math.floor(Math.random() * 20);
		const startY = 0;
		const endX = Math.floor(Math.random() * 20);
		const endY = 19;
    createMaze(squares, startX, startY, endX, endY);
    // squares[startX][startY][4] = 1;
    this.setState({
      squares: squares,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY,
      currX: null,
      currY: null,
      history: []
    });
  }

	render() {
		let status = <button className="button" onClick={() => this.start()}>Start</button>;
		if (this.state.currX === this.state.endX && this.state.currY === this.state.endY) {
			status = (
				<div>
					<b>Finish!</b>
	    		<br/>
	    		<br/>
	    		<br/>
	    		<button className="button" onClick={() => this.replay()}>Play again</button>
				</div>
			);
		} else if (this.state.currX != null && this.state.currY != null) {
			status = <button className="button" onClick={() => this.restart()}>Start over</button>;
		}
		return (
			<div>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div style={{display:'flex'}}>
		    	<Link href="/">
		    		<a className="button">&larr;</a>
		      </Link>
		    </div>
        <div className="container">
          <h1 style={{fontSize:'48px',fontFamily:'Courier, monospace'}}>Maze</h1>
          <br/>
          <div tabIndex="0" onKeyDown={(event) => this.handleKey(event)} className={styles.game}>
          	<Maze
          		squares={this.state.squares}
          		currX={this.state.currX}
          		currY={this.state.currY}
          	/>
	          <div className={styles.gameinfo}>
		          {status}
	        	</div>
	        </div>
        </div>
      </div>
		);
	}
}

export default MazeGame;

function createMaze(maze, startX, startY, endX, endY) {
	// create maze left and right border
	for (let x = 0; x < 20; x++) {
		if (x != startX) {
			maze[x][0][2] = 1;
		}
		if (x != endX) {
			maze[x][19][0] = 1;
		}
	}

	// create maze top and bottom border
	for (let y = 0; y < 20; y++) {
		maze[0][y][3] = 1;
		maze[19][y][1] = 1;
	}

	const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
	const visited = new Set();
	const stack = [[startX, startY, 0]];
	while (stack.length) {
		let [x, y, d] = stack.pop();
		if (visited.has(20*x+y)) {
			continue;
		}
		visited.add(20*x+y);
		if (x == endX && y == endY) {
			continue;
		}
		let i = Math.floor(Math.random() * 4);
		for (let j = 0; j < 4; j++) {
			let new_d = (i+j)%4;
			if (new_d != (d+2)%4) {
				let [dx, dy] = directions[new_d];
				if (x+dx >= 0 && x+dx < 20 && y+dy >= 0 && y+dy < 20 && !maze[x][y][new_d]) {
					if (!visited.has(20*(x+dx)+(y+dy))) {
						stack.push([x+dx, y+dy, new_d]);
						let w = (new_d+1)%4;
						if (w != (d+2)%4) {
							maze[x][y][w] = 1;
							let [wx, wy] = directions[w];
							if (x+wx >= 0 && x+wx < 20 && y+wy >= 0 && y+wy < 20) {
								maze[x+wx][y+wy][(w+2)%4] = 1;
							}
						}
						w = (new_d+3)%4;
						if (w != (d+2)%4) {
							maze[x][y][w] = 1;
							let [wx, wy] = directions[w];
							if (x+wx >= 0 && x+wx < 20 && y+wy >= 0 && y+wy < 20) {
								maze[x+wx][y+wy][(w+2)%4] = 1;
							}
						}
					} else {
						maze[x][y][new_d] = 1;
						let [wx, wy] = directions[new_d];
						if (x+wx >= 0 && x+wx < 20 && y+wy >= 0 && y+wy < 20) {
							maze[x+wx][y+wy][(new_d+2)%4] = 1;
						}
					}
				}
			}
		}
	}
}