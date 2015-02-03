import Ember from 'ember';

var Router = Ember.Router.extend({
  location: MorphityENV.locationType
});

Router.map(function() {
  this.route('application');
  this.route('viewport');
  this.route('map');
  this.route('npcs');
});

export default Router;
