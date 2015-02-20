import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/me").then(function(me) {
      var result = {};
      result['me'] = me;

      var map_id = me['position']['map'];

      return Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/map/" + map_id).then(function(map) {
        result['map'] = map;

        return result;
      });
    });
  },


});
