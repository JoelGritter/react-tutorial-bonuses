import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let toReturn = [];
    for(let i = 0; i < 3; i++){
      let tmp = [];
      for(let j = 0; j < 3; j++){
        tmp.push(this.renderSquare((i*3)+j));
      }
      toReturn.push(<div className="board-row">{tmp}</div>);
    }
    return toReturn;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coords: Array(18).fill(null),
      }],
      reversed: false,
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coords = current.coords.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    coords[(this.state.stepNumber+1)*2] = i%3;
    coords[(this.state.stepNumber+1)*2+1] = Math.floor(i/3);
    this.setState({
      history: history.concat([{
        squares: squares,
        coords: coords,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleReverse() {
    this.setState({
      reversed: !this.state.reversed,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const coords = current.coords;
    const reversed = this.state.reversed;


    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {coords[move*2] !== null? " " + coords[move*2] + "," + coords[(move*2)+1] : null}
        </li>
      )
      if(this.state.stepNumber == move){
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
            {coords[move*2] !== null? " " + coords[move*2] + "," + coords[(move*2)+1] : null}
          </li>
        )
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
            {coords[move*2] !== null? " " + coords[move*2] + "," + coords[(move*2)+1] : null}
          </li>
        )
      }
    });

    let status;
    if(winner){
      status = 'Winner : ' + winner;
    } else {
      if(history.length < 10){
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = 'It\'s a draw!';
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleReverse()}>Click to reverse list</button>
          <ol>{reversed ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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