import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
//    var bla = this;
//    Ember.$.ajax('http://localhost:8080/api/map/3').then(function(newMap) {
//      bla.set('map', newMap);
//      alert(newMap);
//    });

    return Ember.$.ajax("http://localhost:8080/api/me").then(function(result) {
      return Ember.$.ajax("http://localhost:8080/api/map/1").then(function(result2) {
        result['map'] = result2;

        return result;
      });
    });
  },
});
