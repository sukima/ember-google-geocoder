import Ember from 'ember';

// https://gist.github.com/andyhd/1618403
export default function maybe(value) {
  function isNone() { return Ember.isNone(value); }
  function isPresent() { return Ember.isPresent(value); }
  let obj = {
    isNone, isPresent,
    map(f) { return isNone() ? obj : maybe(f(value)); },
    getOrElse(n) { return isNone() ? n : value; }
  };
  return obj;
}
