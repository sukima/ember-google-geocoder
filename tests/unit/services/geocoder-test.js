import { typeOf, isNone, isEmpty } from '@ember/utils';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import geocodeResponse from '../../fixtures/geocode-response';
import reverseGeocodeResponse from '../../fixtures/reverse-geocode-response';

const OK           = 0;
const ZERO_RESULTS = 1;

class FakeGeocoder {
  constructor(response, status) {
    this.response = response;
    this.status   = status;
  }

  geocode(__, callback) {
    callback(this.response, this.status);
  }
}

const fakeGoogle = {
  maps: {
    GeocoderStatus: {OK, ZERO_RESULTS}
  }
};

module('Unit | Service | Geocoder', function(hooks) {
  setupTest(hooks);

  test('A successful geocode returns the proper location', function(assert) {
    assert.expect(3);
    const fakeGoogleGeocoder = new FakeGeocoder(geocodeResponse(), OK);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: fakeGoogle, _geocoder: fakeGoogleGeocoder});
    return geocoder.query({address: 'new haven, ct'}).then(result => {
      assert.equal(typeOf(result), 'object', 'expected response to return an object');
      assert.equal(typeOf(result.lat), 'number', 'expected result.lat to be a number');
      assert.equal(typeOf(result.lng), 'number', 'expected result.lng to be a number');
    });
  });

  test('A successful geocode returns the proper bounds', function(assert) {
    assert.expect(2);
    const fakeGoogleGeocoder = new FakeGeocoder(geocodeResponse(), OK);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: fakeGoogle, _geocoder: fakeGoogleGeocoder});
    return geocoder.query({address: 'new haven, ct'}).then(result => {
      assert.equal(typeOf(result.viewport), 'object', 'expected result.viewport to be an object');
      assert.equal(typeOf(result.viewport.bounds), 'object', 'expected result.viewport.bounds to be an object');
    });
  });

  test('A successful geocode returns the proper address', function(assert) {
    assert.expect(1);
    const fakeGoogleGeocoder = new FakeGeocoder(geocodeResponse(), OK);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: fakeGoogle, _geocoder: fakeGoogleGeocoder});
    return geocoder.query({address: 'new haven, ct'}).then(result => {
      assert.equal(typeOf(result.address), 'object', 'expected result.address to be an object');
    });
  });

  test('An empty result geocode returns an empty object', function(assert) {
    assert.expect(3);
    const fakeGoogleGeocoder = new FakeGeocoder(geocodeResponse(false), ZERO_RESULTS);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: fakeGoogle, _geocoder: fakeGoogleGeocoder});
    return geocoder.query({address: 'new haven, ct'}).then(result => {
      assert.equal(typeOf(result), 'object', 'expected response to return an object');
      assert.ok(isNone(result.lat), 'expected result.lat to be undefined');
      assert.ok(isNone(result.lng), 'expected result.lng to be undefined');
    });
  });

  test('A successful reverse geocode returns an array of addresses', function(assert) {
    assert.expect(2);
    const fakeGoogleGeocoder = new FakeGeocoder(reverseGeocodeResponse(), OK);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: fakeGoogle, _geocoder: fakeGoogleGeocoder});
    return geocoder.reverseQuery({location: {lat: 0.0, lng: 0.0}}).then(result => {
      assert.equal(typeOf(result), 'array', 'expected response to return an array');
      assert.ok(result.length > 0, 'expected response to have a length > 0');
    });
  });

  test('An empty result reverse geocode returns an empty array', function(assert) {
    assert.expect(2);
    const fakeGoogleGeocoder = new FakeGeocoder(reverseGeocodeResponse(false), ZERO_RESULTS);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: fakeGoogle, _geocoder: fakeGoogleGeocoder});
    return geocoder.reverseQuery({location: {lat: 0.0, lng: 0.0}}).then(result => {
      assert.equal(typeOf(result), 'array', 'expected response to return an array');
      assert.ok(isEmpty(result), 'expected response to be empty');
    });
  });

  test('Throws exception with a geocode when google global is undefined', function(assert) {
    assert.expect(1);
    const fakeGoogleGeocoder = new FakeGeocoder(geocodeResponse(false), ZERO_RESULTS);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: undefined, _geocoder: fakeGoogleGeocoder});
    assert.throws(() => {
      geocoder.query({address: 'new haven, ct'});
    });
  });

  test('Throws exception with a reverse geocode when google global is undefined', function(assert) {
    assert.expect(1);
    const fakeGoogleGeocoder = new FakeGeocoder(reverseGeocodeResponse(), OK);
    const geocoder = this.owner.factoryFor('service:geocoder').create({google: undefined, _geocoder: fakeGoogleGeocoder});
    assert.throws(() => {
      geocoder.reverseQuery({location: {lat: 0.0, lng: 0.0}});
    });
  });
});
