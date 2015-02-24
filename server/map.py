# Copyright 2013 Google Inc. All Rights Reserved.

from google.appengine.ext import ndb
from google.appengine.ext import blobstore

class Map(ndb.Model):
    name    = ndb.StringProperty(required=True)
    details = ndb.StringProperty(required=True)

    @staticmethod
    def get_map(name):
        map = Map.query(Map.name == name).fetch(1)

        if(map and len(map) > 0):
            return map[0].details

        return

    @staticmethod
    def set_map(name, details):
        map = Map.query(Map.name == name).fetch(1)
        if(map and len(map) > 0):
            map = map[0]
        else:
            map = Map()
            map.name = name

        map.details = details
        map.put()

