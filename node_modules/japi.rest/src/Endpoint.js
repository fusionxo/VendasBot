module.exports = class Endpoint {
  constructor(main, route) {
    this.main = main;
    this.route = route;

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(k => k !== 'constructor' && !k.startsWith('_'))) this[key] = this[key];
  }

  _get(path) {
    return this.main.get(this.route+path);
  }
}