import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const winningStyle = {
  color: 'green',
}

const boldStyle = {
  'font-weight': 'bold',
}


function Square (props) {
    return (
      <button 
        style={props.isWinning? winningStyle:null}
        className='square'
        onClick={props.onClick}
        >
        {props.value}
      </button>
    );
}

class SquareElement {
  constructor(value, isWinning) {
    this.value = value;
    this.isWinning = isWinning;
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i].value}
        isWinning={this.props.squares[i].isWinning}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      return;
    }

    if (squares[i].value) {
      return;
    }

    let elem = new SquareElement(this.state.xIsNext ? 'X' : 'O', false);
    squares[i] = elem;
    
    this.setState({
      history: history.concat([{squares: squares}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,      
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
     })
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: [
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        new SquareElement(null, false),
        ],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  render() {
    
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const gameIsNotOver = canContinuePlaying(current.squares);

    const moves = history.map( (step, move) => {
      const desc = move ?
      'Go to move #' + move:
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={this.state.stepNumber == move ? boldStyle : null}>{desc}</button>
        </li>
        );
     });

    let status;
    if (winner) {
      status = 'Winner:' + winner[0];
      // winner cells
      const [a, b, c] = winner[1];
      console.log('winning cells',  [a, b, c]);
      console.log('current:', current);
      current.squares[a].isWinning = true;
      current.squares[b].isWinning = true;
      current.squares[c].isWinning = true;

    } else  if (gameIsNotOver)  {
      status = 'Next player:' + (this.state.xIsNext ? 'X':'O')
    } else{
      status = 'Game over!'
    } 

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
    if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
      return [squares[a].value, lines[i]];
    }
  }
  return null;
}

// To implement feature: "When no one wins, display a message about the result being a draw"
function canContinuePlaying(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i].value)
      return true;
  }
}

















