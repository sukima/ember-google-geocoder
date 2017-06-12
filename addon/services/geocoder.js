import Ember from 'ember';
import { Address, Point, Viewport } from '../-google-maps';
import {
  GeoCodingError, GeoCodingOverLimitError, GeoCodingRequestDeniedError,
  GeoCodingInvalidRequestError
} from '../-geo-coding-error';
import maybe from '../-maybe';

export default Ember.Service.extend({
  name: 'Google Maps',

  google: Ember.computed(function () {
    return window.google;
  }).volatile(),

  _geocoder: Ember.computed(function () {
    const google = this.get('google');
    return new google.maps.Geocoder();
  }),

  _promisedGeocode(args) {
    const google = this.get('google');
    Ember.assert('Google API is unavailable', google);
    return new Ember.RSVP.Promise((resolve, reject) => {
      const {
        OK, ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED, INVALID_REQUEST
      } = google.maps.GeocoderStatus;
      this.get('_geocoder').geocode(args, (results, status) => {
        if (status === OK || status === ZERO_RESULTS) {
          resolve(results);
        } else {
          let message = Ember.get(results, 'error_message') || '';
          switch (status) {
            case OVER_QUERY_LIMIT:
              return reject(new GeoCodingOverLimitError(message, results));
            case REQUEST_DENIED:
              return reject(new GeoCodingRequestDeniedError(message, results));
            case INVALID_REQUEST:
              return reject(new GeoCodingInvalidRequestError(message, results));
            default:
              return reject(new GeoCodingError(message, results));
          }
        }
      });
    });
  },

  isGeoCodingError(error) {
    return error instanceof GeoCodingError;
  },

  isGeoCodingOverLimitError(error) {
    return error instanceof GeoCodingOverLimitError;
  },

  isGeoCodingRequestDeniedError(error) {
    return error instanceof GeoCodingRequestDeniedError;
  },

  isGeoCodingInvalidRequestError(error) {
    return error instanceof GeoCodingInvalidRequestError;
  },

  // args => {address: 'new haven, ct'}
  query(args) {
    return this._promisedGeocode(args).then(results => {
      const loc          = maybe(Ember.get(results, '0.geometry.location'));
      const viewport     = maybe(Ember.get(results, '0.geometry.viewport'));
      const addressParts = maybe(Ember.get(results, '0.address_components'));

      let retVal      = loc.map(loc => new Point(loc)).getOrElse({});
      retVal.results  = results;
      retVal.viewport = viewport.map(vp => new Viewport(vp)).getOrElse();
      retVal.address  = addressParts.map(parts => new Address(parts)).getOrElse();

      return retVal;
    });
  },

  // args => {location: {lat: 0.0, lng: 0.1}}
  reverseQuery(args) {
    return this._promisedGeocode(args).then(results => {
      return results.map(result => new Address(result['address_components']));
    });
  }
});
