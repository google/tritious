// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.

import Ember from 'ember';

var Router = Ember.Router.extend({
  location: TritiousENV.locationType
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
