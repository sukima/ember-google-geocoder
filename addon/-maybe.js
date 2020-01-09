import { isNone, isPresent } from '@ember/utils';

// https://gist.github.com/andyhd/1618403
export default function maybe(value) {
  let obj = {
    isNone, isPresent,
    map(f) { return isNone() ? obj : maybe(f(value)); },
    getOrElse(n) { return isNone() ? n : value; }
  };
  return obj;
}
