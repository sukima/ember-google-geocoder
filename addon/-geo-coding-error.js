// As of this comment the Babel compiler version we use does not properly
// manage sub-sub-classes of type Error (which is what Ember.Error is. Till we
// can upgrade Ember (and consequently Babel) we will have to roll our own.
// This was taken from [Ember 2.13][1].
// [1]: https://github.com/emberjs/ember.js/blob/v2.13.0/packages/ember-debug/lib/error.js
import EmberError from '@ember/error';

export class GeoCodingError extends EmberError {
  constructor(message, results) {
    super();

    if (!(this instanceof GeoCodingError)) {
      return new GeoCodingError(message);
    }

    let error = Error.call(this, message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GeoCodingError);
    } else {
      this.stack = error.stack;
    }

    this.description = error.description;
    this.fileName = error.fileName;
    this.lineNumber = error.lineNumber;
    this.message = error.message;
    this.number = error.number;
    this.code = error.code;
    this.name = 'GeoCodingError';
    this.results = results;
  }
}

export class GeoCodingOverLimitError extends GeoCodingError {
  constructor(message, results) {
    super(message, results);
    this.name = 'GeoCodingOverLimitError';
  }
}

export class GeoCodingRequestDeniedError extends GeoCodingError {
  constructor(message, results) {
    super(message, results);
    this.name = 'GeoCodingRequestDeniedError';
  }
}

export class GeoCodingInvalidRequestError extends GeoCodingError {
  constructor(message, results) {
    super(message, results);
    this.name = 'GeoCodingInvalidRequestError';
  }
}
