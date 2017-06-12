function joinedAddress(strings, ...values) {
  return values.reduce((memo, value, i) => {
    if (value && value !== '') {
      memo.push(value, strings[i + 1]);
    }
    return memo;
  }, [strings[0]]).join('');
}

export class Address {
  constructor(components) {
    this._components = components;
  }

  findByType(key) {
    return this._components.find(item => item.types[0] === key) || {};
  }

  get streetNumber() {
    return this.findByType('street_number')['long_name'] || '';
  }

  get streetName() {
    return this.findByType('route')['long_name'] || '';
  }

  get cityName() {
    return this.findByType('locality')['long_name'] || '';
  }

  get stateName() {
    return this.findByType('administrative_area_level_1')['short_name'] || '';
  }

  toString() {
    return joinedAddress`${this.streetNumber} ${this.streetName}, ${this.cityName}, ${this.stateName}`;
  }
}

export class Point {
  constructor(googleLoc) {
    this._loc = googleLoc;
  }

  get lat() {
    return this._loc.lat();
  }

  get lng() {
    return this._loc.lng();
  }

  toString() {
    return `Point(${this.lat},${this.lng})`;
  }
}

export class Viewport {
  constructor(googleViewport) {
    this._viewport = googleViewport;
  }

  get northeast() {
    return new Point(this._viewport.getNorthEast());
  }

  get southwest() {
    return new Point(this._viewport.getSouthWest());
  }

  get bounds() {
    return {
      east:  this.northeast.lng,
      north: this.northeast.lat,
      south: this.southwest.lat,
      west:  this.southwest.lng
    };
  }

  toString() {
    return `Viewport(${this.northeast},${this.southwest})`;
  }
}
