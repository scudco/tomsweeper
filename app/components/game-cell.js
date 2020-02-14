import Component from '@glimmer/component';
import { computed } from '@ember/object';

const colors = [
  'blue',
  'green',
  'red',
  'purple',
  'pink',
  'teal',
  'orange',
  'indigo',
];

export default class GameCell extends Component {
  @computed('args.value')
  get color() {
    return colors[this.args.value - 1];
  }

  @computed('args.{over,revealed}')
  get canReveal() {
    return !this.args.over && !this.args.revealed;
  }

  @computed('args.{revealed,value}')
  get backgroundColor() {
    if (this.args.revealed) {
      if (this.args.value === -1) {
        if (this.args.active) {
          return 'bg-red-400';
        } else {
          return 'bg-gray-100';
        }
      } else if (this.args.value === 0) {
        return 'bg-white';
      }
    }

    return 'bg-gray-200';
  }
}
