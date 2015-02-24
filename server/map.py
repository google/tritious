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

