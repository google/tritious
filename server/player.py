# Copyright 2013 Google Inc. All Rights Reserved.

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
