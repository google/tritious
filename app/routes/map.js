import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return $.ajax("http://localhost:8080/api/map/1"); // TODO: should be using an 'id'
  },
});
