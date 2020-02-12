import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

const sprites = {
  clock: '◷',
  clues: '◻➊➋➌➍➎➏➐➑',
  flag: '✖', // ⚑ Flag does not work in curses?
  mark: '⍰',
  mine: '☀',
  square: '◼',
  face_win: '☻',
  face_play: '☺',
  face_lose: '☹',
};

const colors = [
  'blue',
  'green',
  'red',
  'purple',
  'maroon',
  'turquoise',
  'black',
  'gray',
];

const mine = '/images/tomster.png';

export default class Gameboard extends Component {
  colors = colors;
  sprites = sprites;
  mine = mine;

  @tracked mines = 0;
  @tracked time = 0;
  timer;
  startTime;
  endTime;

  constructor() {
    super(...arguments);
  }

  get face() {
    return this.sprites.face_play;
  }

  get now() {
    return new Date();
  }

  get minesString() {
    return this.mines.toString().padStart(3, '0');
  }

  get timeString() {
    return this.time.toString().padStart(3, '0');
  }

  @action
  reveal(x, y) {
    if (this.startTime) {
      clearInterval(this.timer);
    } else {
      this.start();
    }
  }

  @action
  flag(x, y, evt) {
    evt.preventDefault();
  }

  start() {
    this.startTime = this.now;
    this.timer = setInterval(() => {
      let delta = Math.floor((this.now - this.startTime) / 1000);
      this.time = Math.max(0, delta);
    }, 500);
  }
}
