import Ember from 'ember';

var Router = Ember.Router.extend({
  location: MorphityENV.locationType
});

Router.map(function() {
  this.route('application');
  this.route('viewport', { 'path': '/game/:map_id' });
  this.route('map');
  this.route('npcs');
  this.route('me');
  this.route('objects');
});

export default Router;
