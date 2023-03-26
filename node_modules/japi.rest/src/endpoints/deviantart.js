const Endpoint = require('../Endpoint.js');
module.exports = class DeviantArt extends Endpoint {
  constructor(main) { super(main, 'deviantart/v1/') };

  getTopics() {
    return this._get('topics');
  }
}