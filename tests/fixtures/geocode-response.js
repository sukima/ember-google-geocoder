/* jshint ignore: start */
class GoogleLocation {
  constructor(lat, lng) { this.latlng = [lat, lng]; }
  lat() { return this.latlng[0]; }
  lng() { return this.latlng[1]; }
}

class GoogleViewport {
  constructor(ne, sw) {
    this._ne = ne;
    this._sw = sw;
  }
  getNorthEast() { return new GoogleLocation(this._ne[0], this._ne[1]); }
  getSouthWest() { return new GoogleLocation(this._sw[0], this._sw[1]); }
}

export default function(hasResults=true) {
   return [
      {
         "address_components" : [
            {
               "long_name" : "New Haven",
               "types" : [
                  "locality",
                  "political"
               ],
               "short_name" : "New Haven"
            },
            {
               "long_name" : "New Haven County",
               "types" : [
                  "administrative_area_level_2",
                  "political"
               ],
               "short_name" : "New Haven County"
            },
            {
               "types" : [
                  "administrative_area_level_1",
                  "political"
               ],
               "short_name" : "CT",
               "long_name" : "Connecticut"
            },
            {
               "types" : [
                  "country",
                  "political"
               ],
               "short_name" : "US",
               "long_name" : "United States"
            }
         ],
         "formatted_address" : "New Haven, CT, USA",
         "place_id" : "ChIJ5XCAOkTY54kR7WSyWcZUo_Y",
         "geometry" : {
            "location" : hasResults ? new GoogleLocation(41.30827400, -72.92788350) : null,
            "location_type" : "APPROXIMATE",
            "viewport" : hasResults ? new GoogleViewport([41.30827400, -72.92788350], [41.30827400, -72.92788350]) : null
         },
         "types" : [
            "locality",
            "political"
         ]
      }
   ];
}
