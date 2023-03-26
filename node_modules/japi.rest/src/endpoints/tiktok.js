const Endpoint = require('../Endpoint.js');
module.exports = class Tiktok extends Endpoint {
  constructor(main) { super(main, 'tiktok/v1/') };

  getCreator(creator) {
    if(!creator) throw new Error('No tiktok creator provided');
    if(creator.startsWith('@')) creator = creator.substring(1);
    return this._get('creator/@'+creator);
  }
}