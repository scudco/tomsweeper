import Route from '@ember/routing/route';

const TEMPLATES = {
  'tiny': '5x5x3',
  'small': '9x9x10',
  'medium': '13x13x15',
  'large': '17x17x20',
  'huge': '21x21x25',
};

export default class GameRoute extends Route {
  async model({ options }) {
    let template = TEMPLATES[options] || options;
    let game = template.split('x').map(num => parseInt(num, 10));

    return {
      'width': game[0],
      'height': game[1],
      'mines': game[2],
    }
  }
}
