const Endpoint = require('../Endpoint.js');
module.exports = class MyWaifuList extends Endpoint {
  constructor(main) { super(main, 'mywaifulist/v1/'); }

  /**
   * Get a specific Waifu via the waifu's name.
   * @param {String} waifuName 
   * @returns {Promise<Object>}
   */
  getWaifu(waifuName) {
    if(!waifuName) throw new Error('No waifu to get was provided');
    return this._get('waifu/'+waifuName);
  }

  /**
   * Get a random Waifu.
   * @returns {Promise<Object>}
   */
  getWaifuRandom() {
    return this._get('waifu/random');
  }

  /**
   * Get a list of all the Waifus.
   * @param {String} seriesName
   * @returns {Promise<Object>}
   */
  searchSeries(seriesName) {
    if(!seriesName) throw new Error('No series to search for was provided');
    return this._get('series?q='+encodeURIComponent(seriesName));
  }
  
  /**
   * Get a specific series via the series's name.
   * @param {String} waifuName 
   * @returns {Promise<Object>}
   */
  getSeries(seriesName) {
    if(!seriesName) throw new Error('No series to get was provided');
    return this._get('series?q='+encodeURIComponent(seriesName));
  }

  topTierWaifus() {
    return this._get('best');
  }
  
  mostPopular() {
    return this._get('popular');
  }

  topTrash() {
    return this._get('trash');
  }

  vTubers() {
    return this._get('vtubers');
  }

  seasonalBestWaifus() {
    return this._get('current/best');
  }

  seasonalWorstWaifus() {
    return this._get('current/trash');
  }

  seasonalPopularWaifus() {
    return this._get('current/popular');
  }
}