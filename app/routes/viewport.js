import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
//    var bla = this;
//    Ember.$.ajax('http://localhost:8080/api/map/3').then(function(newMap) {
//      bla.set('map', newMap);
//      alert(newMap);
//    });

    return Ember.$.ajax("http://localhost:8080/api/me").then(function(me) {
      var result = {};
      result['me'] = me;

      return Ember.$.ajax("http://localhost:8080/api/map/" + me['position']['map']).then(function(map) {
        result['map'] = map;

        return result;
      });
    });
//    return Ember.RSVP.hash({
//      me: ,
//      map: Ember.$.ajax("http://localhost:8080/api/map/123")
//    });
  },

});
