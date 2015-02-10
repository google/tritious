import Ember from 'ember';

var Router = Ember.Router.extend({
  location: MorphityENV.locationType
});

Router.map(function() {
  this.route('application');
  this.route('viewport', { 'path': '/' });
  this.route('map');
  this.route('npcs');
  this.route('me');
  this.route('objects');
  this.route('editor');
});

export default Router;
