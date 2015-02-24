#!/usr/bin/env python
#
# Copyright 2015 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#     Unless required by applicable law or agreed to in writing, software
#     distributed under the License is distributed on an "AS IS" BASIS,
#     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#     See the License for the specific language governing permissions and
#     limitations under the License.

from google.appengine.ext import ndb
from google.appengine.ext import blobstore

from google.appengine.api import users

class Player(ndb.Model):
    name = ndb.StringProperty(required=True)
    x    = ndb.IntegerProperty(required=True)
    y    = ndb.IntegerProperty(required=True)
    map  = ndb.StringProperty(required=True)

    @staticmethod
    def get_current_player():
        name = 'Anonymous'
        if(users.get_current_user()):
            name = users.get_current_user().nickname()

        player = Player.query(Player.name == name).fetch(1)

        if(len(player) == 0):
            player = Player()
            player.name = name
            player.x    = 4
            player.y    = 4
            player.map  = "main"
        else:
            player = player[0]

        return player

    def create_token(self):
        return "mytoken1337" # XXX: Generate actual tokens

    def verify_token(self, t):
        return (t == "mytoken1337") # XXX: Generate actual tokens
