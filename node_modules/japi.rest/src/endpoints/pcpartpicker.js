const Endpoint = require('../Endpoint.js');
module.exports = class PCPartPicker extends Endpoint {
  constructor(main) { super(main, 'pcpartpicker/v1/') };

  getList(listId) {
    if(!listId) throw new Error('No listId provided');
    return this._get('list/'+listId);
  }
}