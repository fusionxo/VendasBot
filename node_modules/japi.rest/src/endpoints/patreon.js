const Endpoint = require('../Endpoint.js');
module.exports = class Patreon extends Endpoint {
  constructor(main) { super(main, 'patreon/v1/') };

  getCreator(creator) {
    if(!creator) throw new Error('No patreon creator provided');
    return this._get('info/@'+creator);
  }
}