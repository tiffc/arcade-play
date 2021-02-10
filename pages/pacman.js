import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import styles from '../styles/pacman.module.css'

function Maze(props) {
	const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 352;
    const context = canvas.getContext('2d');
    props.createMaze(context);
  }, []);
  
  return <canvas ref={canvasRef} {...props}/>
}

function Canvas(props) {
	const canvasRef = useRef(null);
  
  useEffect(() => {
  	const canvas = canvasRef.current;
  	canvas.width = 640;
    canvas.height = 352;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    props.placeFood(context);
  }, [props.placeFood]);
  
  return <canvas ref={canvasRef} {...props}/>
}

class Pacman extends React.Component {
	constructor(props) {
		super(props);
		const squares = [];
    for (let i = 0; i < 11; i++) {
    	const row = [];
    	for (let j = 0; j < 20; j++) {
    		row.push([0,0,0,0,0]);
    	}
    	squares.push(row);
    }
    this.state = {
    	squares: squares
    };
	}

  createMaze(ctx) {

  	ctx.strokeStyle = 'blue';
		ctx.lineWidth = 3.0;
		// draw top border
		ctx.beginPath();
		ctx.moveTo(0, 160);
		ctx.lineTo(0, 0);
		ctx.lineTo(640, 0);
		ctx.lineTo(640, 160);
		ctx.stroke();
		// draw bottom border
		ctx.beginPath();
		ctx.moveTo(0, 192);
		ctx.lineTo(0, 352);
		ctx.lineTo(640, 352);
		ctx.lineTo(640, 192);
		ctx.stroke();

		const squares = [];
    for (let i = 0; i < 11; i++) {
    	const row = [];
    	for (let j = 0; j < 20; j++) {
    		row.push(this.state.squares[i][j].slice());
    	}
    	squares.push(row);
    }

    for (let x = 0; x < 11; x++) {
			if (x != 10) {
				squares[x][0][2] = 1;
				squares[x][19][0] = 1;
			}
		}

		for (let y = 0; y < 20; y++) {
			squares[0][y][3] = 1;
			squares[10][y][1] = 1;
		}

		const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
		const visited = new Set();
		const stack = [[5, 0, 0]];
		while (stack.length) {
			let [x, y, d] = stack.pop();
			if (visited.has(20*x+y)) {
				continue;
			}
			visited.add(20*x+y);
			if (x == 5 && y == 19) {
				continue;
			}
			let i = Math.floor(Math.random() * 4);
			for (let j = 0; j < 4; j++) {
				let new_d = (i+j)%4;
				if (new_d != (d+2)%4) {
					let [dx, dy] = directions[new_d];
					if (x+dx >= 0 && x+dx < 11 && y+dy >= 0 && y+dy < 20 && !squares[x][y][new_d]) {
						stack.splice(0, 0, [x+dx, y+dy, new_d]);
						let w = (new_d+1)%4;
						if (w != (d+2)%4) {
							squares[x][y][w] = 1;
							let [wx, wy] = directions[w];
							if (x+wx >= 0 && x+wx < 11 && y+wy >= 0 && y+wy < 20) {
								squares[x+wx][y+wy][(w+2)%4] = 1;
							}
							if (w === 0 || w === 2) {
								this.drawWall(ctx, y*32+32, x*32, y*32+32, x*32+32);
							} else if (w === 1) {
								this.drawWall(ctx, y*32, x*32+32, y*32+32, x*32+32);
							} else if (w === 2) {
								this.drawWall(ctx, y*32, x*32, y*32, x*32+32);
							} else {
								this.drawWall(ctx, y*32, x*32, y*32+32, x*32);
							}
						}
						w = (new_d+3)%4;
						if (w != (d+2)%4) {
							squares[x][y][w] = 1;
							let [wx, wy] = directions[w];
							if (x+wx >= 0 && x+wx < 11 && y+wy >= 0 && y+wy < 20) {
								squares[x+wx][y+wy][(w+2)%4] = 1;
							}
							if (w === 0) {
								this.drawWall(ctx, y*32+32, x*32, y*32+32, x*32+32);
							} else if (w === 1) {
								this.drawWall(ctx, y*32, x*32+32, y*32+32, x*32+32);
							} else if (w === 2) {
								this.drawWall(ctx, y*32, x*32, y*32, x*32+32);
							} else {
								this.drawWall(ctx, y*32, x*32, y*32+32, x*32);
							}
						}
					}
				}
			}
		}

		this.setState({
			squares: squares
		});
	}

	drawWall(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	placeFood(ctx) {
		ctx.fillStyle = "#ffcc99";

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
		const visited = new Set();
		const stack = [[10, 0, 0]];
		while (stack.length) {
			let [x, y, d] = stack.pop();
			if (visited.has(20*x+y)) {
				continue;
			}
			visited.add(20*x+y);
			if (x == 5 && y == 19) {
				continue;
			}
			if (d == 0) {
				this.drawFood(ctx, y*32, x*32+16);
				this.drawFood(ctx, y*32+16, x*32+16);
			} else 
			if (d == 1) {
				this.drawFood(ctx, y*32+16, x*32);
				this.drawFood(ctx, y*32+16, x*32+16);
			} else 
			if (d == 2) {
				this.drawFood(ctx, y*32+32, x*32+16);
				this.drawFood(ctx, y*32+16, x*32+16);
			} else 
			if (d == 3) {
				this.drawFood(ctx, y*32+16, x*32+32);
				this.drawFood(ctx, y*32+16, x*32+16);
			}
			for (let new_d = 0; new_d < 4; new_d++) {
				if (new_d != (d+2)%4) {
					let [dx, dy] = directions[new_d];
					if (x+dx >= 0 && x+dx < 11 && y+dy >= 0 && y+dy < 20 && !this.state.squares[x][y][new_d]) {
						stack.splice(0, 0, [x+dx, y+dy, new_d]);
					}
				}
			}
		}
	}

	drawFood(ctx, x, y) {
		ctx.beginPath();
		ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	render () {
		return (
			<div>
        <div className="stars"></div>
        <div className="twinkling"></div>
	    	<Link href="/">
	    		<a className="button">&larr;</a>
	      </Link>
        <div className="container">
          <h1 style={{fontSize:'48px',fontFamily:'Courier, monospace'}}>Pacman</h1>
          <Maze
          	createMaze={(ctx) => this.createMaze(ctx)}
          />
	        <div style={{position:'absolute', left:8, top:120, width:'100%', height:'100%', zIndex:1}}>
	          <Canvas
	          	placeFood={(ctx) => this.placeFood(ctx)}
	          />
	        </div>
        </div>
      </div>
		);
	}
}

export default Pacman;

// function Square(props) {
// 	const pacman = <div className={styles.pacman}/>
// 	const style = {
// 		borderRight: props.properties[0] ? '1px solid blue' : 'none',
// 		borderBottom: props.properties[1] ? '1px solid blue' : 'none',
// 		borderLeft: props.properties[2] ? '1px solid blue' : 'none',
// 		borderTop: props.properties[3] ? '1px solid blue' : 'none'
// 	};
//   return (
//     <div className={styles.square} style={style}>
//     	{pacman}
//     </div>
//   );
// }

// class Maze extends React.Component {
// 	renderSquare(i, j) {
// 		let current = false;
// 		if (this.props.currX === i && this.props.currY === j) {
// 			current = true;
// 		}
//     return (
//       <Square
//       	key={11*i+j}
//       	properties={this.props.squares[i][j]}
//       	current={current}
//       />
//     );
//   }

// 	renderRow(i) {
//   	const rows = [];
//   	for (let j = 0; j < 11; j++) {
//   		rows.push(this.renderSquare(i, j));
//   	}
//   	return (
//   		<div key={i} className={styles.row}>
//   			{rows}
//   		</div>
//   	);
//   }

// 	render() {
//   	const maze = []
//   	for (let i = 0; i < 11; i++) {
//   		maze.push(this.renderRow(i));
//   	}
//     return (
//       <div>
//         {maze}
//       </div>
//     );
//   }
// }

// class Pacman extends React.Component {
// 	constructor(props) {
//     super(props);
//     const squares = [];
//     for (let i = 0; i < 11; i++) {
//     	const row = [];
//     	for (let j = 0; j < 11; j++) {
//     		row.push([0,0,0,0,0]);
//     	}
//     	squares.push(row);
//     }
//     const startX = 10;
// 		const startY = 0;
// 		const endX = 10;
// 		const endY = 20;
//     createMaze(squares, startX, startY, endX, endY);
//   	this.state = {
//   		squares: squares,
//       startX: startX,
//       startY: startY,
//       endX: endX,
//       endY: endY,
//       currX: null,
//       currY: null,
//       history: []
//   	};
//   }

//   handleKey(event) {
//   	if (this.state.currX != this.state.endX || this.state.currY != this.state.endY) {
//   		const squares = [];
//   		for (let i = 0; i < 11; i++) {
// 	  		let row = [];
// 	  		for (let j = 0; j < 11; j++) {
// 	  			row.push(this.state.squares[i][j].slice());
// 	  		}
// 	  		squares.push(row);
// 	  	}
// 	  	const history = this.state.history.slice();
// 	  	let currX = this.state.currX;
// 	  	let currY = this.state.currY;
// 	  	// left
// 	  	if (event.keyCode === 37 && currY-1 >= 0 && !squares[currX][currY][2]) {
// 	  		if (history[history.length-1] === 0) {
// 	  			squares[currX][currY][4] = 0;
// 	  			history.pop();
// 	  		} else {
// 	  			history.push(2);
// 	  		}
// 	  		currY--;
// 	  		squares[currX][currY][4] = 1;
// 	  	}
// 	  	// up
// 	  	if (event.keyCode === 38 && currX-1 >= 0 && !squares[currX][currY][3]) {
// 	  		if (history.length && history[history.length-1] === 1) {
// 	  			squares[currX][currY][4] = 0;
// 	  			history.pop();
// 	  		} else {
// 	  			history.push(3);
// 	  		}
// 	  		currX--;
// 	  		squares[currX][currY][4] = 1;
// 	  	}
// 	  	// right
// 	  	if (event.keyCode === 39 && currY+1 < 11 && !squares[currX][currY][0]) {
// 	  		if (history.length && history[history.length-1] === 2) {
// 	  			squares[currX][currY][4] = 0;
// 	  			history.pop();
// 	  		} else {
// 	  			history.push(0);
// 	  		}
// 	  		currY++;
// 	  		squares[currX][currY][4] = 1;
// 	  	}
// 	  	// down
// 	  	if (event.keyCode === 40 && currX+1 < 11 && !squares[currX][currY][1]) {
// 	  		if (history.length && history[history.length-1] === 3) {
// 	  			squares[currX][currY][4] = 0;
// 	  			history.pop();
// 	  		} else {
// 	  			history.push(1);
// 	  		}
// 	  		currX++;
// 	  		squares[currX][currY][4] = 1;
// 	  	}
// 	  	this.setState({
// 	  		squares: squares,
// 	  		currX: currX,
// 	  		currY: currY,
// 	  		history: history
// 	  	});
// 	  }
//   }

//   start() {
//   	const squares = [];
//   	for (let i = 0; i < 11; i++) {
//     	const row = [];
//     	for (let j = 0; j < 11; j++) {
//     		row.push(this.state.squares[i][j].slice());
//     	}
//     	squares.push(row);
//     }
//     squares[this.state.startX][this.state.startY][4] = 1;
//     this.setState({
//       squares: squares,
//       currX: this.state.startX,
//       currY: this.state.startY
//     });
//   }

//   replay() {
//   	const squares = [];
//     for (let i = 0; i < 11; i++) {
//     	const row = [];
//     	for (let j = 0; j < 11; j++) {
//     		row.push([0,0,0,0,0]);
//     	}
//     	squares.push(row);
//     }
//     const startX = 10;
// 		const startY = 0;
// 		const endX = 10;
// 		const endY = 20;
//     createMaze(squares, startX, startY, endX, endY);
//     this.setState({
//       squares: squares,
//       startX: startX,
//       startY: startY,
//       endX: endX,
//       endY: endY,
//       currX: null,
//       currY: null,
//       history: []
//     });
//   }

// 	render() {
// 		let status = <button className="button" onClick={() => this.start()}>Start</button>;
// 		if (this.state.currX === this.state.endX && this.state.currY === this.state.endY) {
// 			status = (
// 				<div>
// 					<b>Finish!</b>
// 	    		<br/>
// 	    		<br/>
// 	    		<br/>
// 	    		<button className="button" onClick={() => this.replay()}>Play again</button>
// 				</div>
// 			);
// 		} else if (this.state.currX != null && this.state.currY != null) {
// 			status = <button className="button" onClick={() => this.restart()}>Start over</button>;
// 		}
// 		return (
// 			<div>
//         <div className="stars"></div>
//         <div className="twinkling"></div>
// 	    	<Link href="/">
// 	    		<a className="button">&larr;</a>
// 	      </Link>
//         <div className="container">
//           <h1 style={{fontSize:'48px',fontFamily:'Courier, monospace'}}>Pacman</h1>
//           <div tabIndex="0" onKeyDown={(event) => this.handleKey(event)} className={styles.game}>
// 		        <Maze 
// 		          squares={this.state.squares}
// 		      		currX={this.state.currX}
// 		      		currY={this.state.currY}
// 		        />
// 		        <div className={styles.gameinfo}>
// 		          {status}
// 		        </div>
// 		      </div>
//         </div>
//       </div>
// 		);
// 	}
// }

// export default Pacman;

// function createMaze(maze, startX, startY, endX, endY) {
// 	const N = maze.length;
// 	// create maze left and right border
// 	for (let x = 0; x < N; x++) {
// 		if (x != startX) {
// 			maze[x][0][2] = 1;
// 		}
// 		if (x != endX) {
// 			maze[x][N-1][0] = 1;
// 		}
// 	}

// 	// create maze top and bottom border
// 	for (let y = 0; y < N; y++) {
// 		maze[0][y][3] = 1;
// 		maze[N-1][y][1] = 1;
// 	}

// 	const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
// 	const visited = new Set();
// 	const stack = [[startX, startY, 0]];
// 	while (stack.length) {
// 		let [x, y, d] = stack.pop();
// 		if (visited.has(N*x+y)) {
// 			continue;
// 		}
// 		visited.add(N*x+y);
// 		if (x == endX && y == endY) {
// 			continue;
// 		}
// 		let i = Math.floor(Math.random() * 4);
// 		for (let j = 0; j < 4; j++) {
// 			let new_d = (i+j)%4;
// 			if (new_d != (d+2)%4) {
// 				let [dx, dy] = directions[new_d];
// 				if (x+dx >= 0 && x+dx < N && y+dy >= 0 && y+dy < N && !maze[x][y][new_d]) {
// 					stack.splice(0, 0, [x+dx, y+dy, new_d]);
// 					let w = (new_d+1)%4;
// 					if (w != (d+2)%4) {
// 						maze[x][y][w] = 1;
// 						let [wx, wy] = directions[w];
// 						if (x+wx >= 0 && x+wx < N && y+wy >= 0 && y+wy < N) {
// 							maze[x+wx][y+wy][(w+2)%4] = 1;
// 						}
// 					}
// 					w = (new_d+3)%4;
// 					if (w != (d+2)%4) {
// 						maze[x][y][w] = 1;
// 						let [wx, wy] = directions[w];
// 						if (x+wx >= 0 && x+wx < N && y+wy >= 0 && y+wy < N) {
// 							maze[x+wx][y+wy][(w+2)%4] = 1;
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// }