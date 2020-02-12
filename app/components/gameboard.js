import Component from '@glimmer/component';
import { A } from '@ember/array';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default class Gameboard extends Component {
  timer;
  startTime;
  endTime;

  @tracked board = A();
  @tracked flaggedCells = A();
  @tracked markedCells = A();
  @tracked minedCells = A();
  @tracked revealedCells = A();
  @tracked time = 0;

  constructor() {
    super(...arguments);

    this.mineCount = this.args.mineCount;
    this.width = this.args.width;
    this.height = this.args.height;
    this.board = {};
  }

  get face() {
    return this.sprites.face_play;
  }

  get now() {
    return new Date();
  }

  get minesString() {
    let remainingMines = this.minedCells.length - this.flaggedCells.length;
    return remainingMines.toString().padStart(3, '0');
  }

  get timeString() {
    return this.time.toString().padStart(3, '0');
  }

  get won() {
    return !this.lost && this.revealedCells.length === this.width * this.height - this.mineCount;
  }

  get lost() {
    return this.revealedCells.some(cell => this.minedCells.includes(cell));
  }

  get over() {
    return this.won || this.lost;
  }

  @action
  reveal(cell) {
    this.activeCell = cell;

    if (!this.startTime) {
      this.start();
    }

    this._reveal(this.activeCell);

    if (this.over) {
      this.end();
    }
  }

  @action
  flag(cell, evt) {
    evt.preventDefault();
    if (this.revealedCells.includes(cell)) { return; }

    if (this.flaggedCells.includes(cell)) {
      this.flaggedCells.removeObject(cell);
      this.markedCells.addObject(cell);
    } else if (this.markedCells.includes(cell)) {
      this.markedCells.removeObject(cell);
    } else if (this.flaggedCells.length === this.minedCells.length) {
      this.markedCells.addObject(cell);
    } else {
      this.flaggedCells.addObject(cell);
    }
  }

  start() {
    this.placeMines();
    this.placeClues();
    this.startTimer();
  }

  end() {
    this.flaggedCells = A();
    this.markedCells = A();
    this.stopTimer();
  }

  placeMines() {
    let mines = A();

    for(let i = 0; i < this.mineCount; i++) {
      let cell;

      do {
        cell = this.randomCell();
      } while (this.activeCell === cell || mines.includes(cell));

      mines.addObject(cell);
      set(this.board, cell, -1);
    }

    this.minedCells = mines;
  }

  placeClues() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.width; y++) {
        let cell = [x,y].join(',');
        let value = 0;

        if (this.minedCells.includes(cell)) {
          value--;
        } else {
          this.neighbors(cell).forEach((neighbor) => {
            let cellValue = this.board[neighbor]
            if (cellValue === -1) { value++ }
          });
        }

        set(this.board, cell, value);
      }
    }
  }

  startTimer() {
    this.startTime = this.now;
    this.timer = setInterval(() => {
      let delta = Math.floor((this.now - this.startTime) / 1000);
      this.time = Math.max(0, delta);
    }, 200);
  }

  stopTimer() {
    this.endTime = this.now;
    clearInterval(this.timer);
  }

  randomCell() {
    return [randomInt(this.width), randomInt(this.height)].join(',');
  }

  neighbors(cell) {
    let [x, y] = cell.split(',').map(num => parseInt(num, 10));

    return [
      [x - 1, y - 1],
      [x - 0, y - 1],
      [x + 1, y - 1],

      [x - 1, y - 0],
      [x + 1, y - 0],

      [x - 1, y + 1],
      [x - 0, y + 1],
      [x + 1, y + 1],
    ].filter(([x,y]) => {
      return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }).map(x => x.join(','));
  }

  _reveal(cell) {
    if (this.flaggedCells.includes(cell)) { return; }

    this.revealedCells.addObject(cell);

    if (this.board[cell] === 0) {
      let cellsToVisit = this.neighbors(cell).filter(neighbor => !this.revealedCells.includes(neighbor));

      cellsToVisit.forEach(neighbor => this._reveal(neighbor));
    }
  }
}
