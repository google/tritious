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

import webapp2
import logging
import json

from google.appengine.ext import ndb

from player import *
from map    import *
from npc    import *

def get_tiles():
    return {
                '404':         { 'passable': False, 'img': 'img/404.png' },
                'corner-bl':   { 'passable': False, 'img': 'img/corner-bl.png' },
                'corner-br':   { 'passable': False, 'img': 'img/corner-br.png' },
                'corner-tl':   { 'passable': False, 'img': 'img/corner-tl.png' },
                'corner-tr':   { 'passable': False, 'img': 'img/corner-tr.png' },
                'floor':       { 'passable': True,  'img': 'img/floor.png' },
                'grass':       { 'passable': True,  'img': 'img/grass.png' },
                'rock':        { 'passable': False, 'img': 'img/rock.png' },
                'wall-bottom': { 'passable': False, 'img': 'img/wall-bottom.png' },
                'wall-left':   { 'passable': True,  'img': 'img/wall-left.png' },
                'wall-top':    { 'passable': False, 'img': 'img/wall-top.png' },
                'wall-right':  { 'passable': True,  'img': 'img/wall-right.png' },
    }

def handle_500(request, response, exception):
    response.out.write("error")

def print_json(handler, obj):
    # If for some reason you're copying my code, be careful with the next line;
    # it shouldn't be used on sites with any private data!
    handler.response.headers['Access-Control-Allow-Origin'] = '*'

    handler.response.headers['Content-Type'] = 'application/json'
    handler.response.out.write(json.dumps(obj, sort_keys=True, indent=4, separators=(',', ': ')))

class ErrorRouter(webapp2.RequestHandler):
    def get(self):
        self.response.out.write("error")

class ApiErrorRouter(webapp2.RequestHandler):
    def get(self):
        print_json(self,
            {
                'status' : 404,
                'error'  : "not found"
            }
        )

class ApiMeRouter(webapp2.RequestHandler):
    def get(self):
        p = Player.get_current_player()
        me = {
            'status'        : 0,
            'name'          : p.name,
            #'name'         : 'MyCharacter',
            "position"      : {"map": p.map, "x": p.x, "y": p.y },
            "img"           : "img/character.png",
            "token"         : p.create_token(),
        }

        p.put()

        print_json(self, me)

class ApiMoveRouter(webapp2.RequestHandler):
    def get(self):
        p = Player.get_current_player()

        if(p.verify_token(self.request.GET.get("token"))):
            x   = int(self.request.GET.get("x"))
            y   = int(self.request.GET.get("y"))
            map = self.request.GET.get("map")

            if(x < 0 or x > 100 or y < 0 or y > 100):
                print_json(self, { 'status': 400, 'error': 'bad coordinates' })
            else:
                p.x = x
                p.y = y
                p.map = map
                p.put()
                print_json(self, { 'status': 0, 'msg': 'Location updated!' })
        else:
            print_json(self, { 'status': 400, 'error': 'Bad token' })

class ApiRegisterRouter(webapp2.RequestHandler):
    def get(self):
        print_json(self, me)


class ApiEditMapRouter(webapp2.RequestHandler):
    def get(self, map_id):
        map = Map.get_map(map_id)
        details = self.request.get("details")

        Map.set_map(map_id, details)
        print_json(self, { 'status': 0, 'msg': 'Saved!' })

class ApiEditNpcRouter(webapp2.RequestHandler):
    def get(self, npc_id):
        npc = Npc.get_npc(npc_id)
        details = self.request.get("details")

        Npc.set_npc(npc_id, details)
        print_json(self, { 'status': 0, 'msg': 'Saved!' })

class ApiMapRouter(webapp2.RequestHandler):
    def get(self, map_id):
        map = Map.get_map(map_id)

        if(map):
            self.response.out.write(map)
            return

        if(map_id == "main"):
            print_json(self, {
                # The array of tiles
                "map": [
#                   ["rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
#                   ["rock",  "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
#                   ["rock",  "grass", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "grass", "rock"],
#                   ["rock",  "grass", "grass", "grass", "grass", "grass", "rock",  "rock",  "grass", "rock"],
#                   ["rock",  "rock",  "rock",  "rock",  "grass", "grass", "grass", "rock",  "grass", "rock"],
#                   ["rock",  "rock",  "rock",  "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
#                   ["rock",  "grass", "grass", "grass", "grass", "rock",  "rock",  "rock",  "rock",  "rock"],
#                   ["rock",  "grass", "grass", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
#                   ["rock",  "grass", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
#                   ["rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],

                    ["corner-tl",                  "wall-top",     "wall-top",     "wall-top",                     "wall-top",     "wall-top",     "wall-top",     "wall-top",     "wall-top",     "corner-tr"],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "wall-bottom"], "wall-bottom",  "wall-bottom",  ["wall-right", "wall-bottom"],  "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"],       "floor",        "floor",        "floor",                        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    ["corner-bl",                  "wall-bottom",  "wall-bottom",  "wall-bottom",                  "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "corner-br"],
                ],

                # NPCs
                "npcs": [
                    { "id": "knight", "x": 6, "y": 4, "img": "img/knight.png" },
                    { "id": "desert", "x": 1, "y": 1, "img": "img/desertnpc.png" },
                ],

                # Objects
                "objects": [
                    {
                        "type":   "exit",
                        "details": {
                            "newmap": "map2",
                            "newx":    1,
                            "newy":    1,
                        },

                        "x":    1,
                        "y":    8,
                        "img":  "img/pipe.png",
                    }
                ],

                # Tiles
                "tiles": get_tiles(),
            })
        elif(map_id == "map2"):
             print_json(self, {
                # The array of tiles
                "map": [
                    ["corner-tl",            "wall-top",     "wall-top",     "wall-top",     "wall-top",     "wall-top",     "wall-top",     "wall-top",     "wall-top",     "corner-tr"],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    [["wall-left", "floor"], "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",        "floor",       ["wall-right", "floor"]],
                    ["corner-bl",            "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "wall-bottom",  "corner-br"],
                ],

                # NPCs
                "npcs": [
                    { "id": "agent", "x": 8, "y": 8, "img": "img/agent.png" },
                ],

                # Objects
                "objects": [
                    {
                        "type":   "exit",
                        "details": {
                            "newmap": "main",
                            "newx":    4,
                            "newy":    4,
                        },

                        "x":    8,
                        "y":    1,
                        "img":  "img/pipe.png",
                    }
                ],

                # Tiles
                "tiles": get_tiles(),
            })
        else:
             print_json(self, {
                # The array of tiles
                "map": [
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                    ["404",  "404", "404", "404", "404", "404", "404", "404", "404", "404"],
                ],

                # NPCs
                "npcs": [],

                # Objects
                "objects": [],

                # Tiles
                "tiles": {
                  "404": {
                      "img":      "img/404.png",
                      "passable": False,
                  },
               }
            })

class ApiTilesRouter(webapp2.RequestHandler):
    def get(self):
        print_json(self, get_tiles())

class ApiNpcRouter(webapp2.RequestHandler):
    def get(self, id):
        result = {}

        npc = Npc.get_npc(id)

        if(npc):
            self.response.out.write(npc)
            return

        if(id == "knight"):
            result = {
                "text": [
                    "Hello, player!",
                    "I may look scary...",
                    "...but I'm just a normal NPC."
                    "..."
                    "Sorry if I disappointed you :(",
                ],
                "name": "Knight",
            }
        elif(id == "desert"):
            result = {
                "text": [
                    "Hi, I think I got lost on my way to the desert",
                    ":("
                ],
                "name": "Desert explorer",
            }
        elif(id == "agent"):
            result = {
                "text": [
                    "Wow, you found the other map!"
                ],
                "name": "Secret Agent",
            }
        else:
            result = {
                "text": [
                    "I may look like an NPC...",
                    "but I'm actually a 404",
                ],
                "img":  "img/404.png"
            }

        print_json(self, result)

class ApiPropertiesRouter(webapp2.RequestHandler):
    def get(self):
        print_json(self, {})

application = webapp2.WSGIApplication([
    # Experimental API
    ('^/api/me',         ApiMeRouter),
    ('^/api/move',       ApiMoveRouter),

    ('^/api/editmap/(\w+)', ApiEditMapRouter),
    ('^/api/editnpc/(\w+)', ApiEditNpcRouter),

    ('^/api/map/(\w+)',     ApiMapRouter),
    ('^/api/npc/(\w+)',     ApiNpcRouter),


    ('^/api/tiles',      ApiTilesRouter),

    ('^/api/register',   ApiRegisterRouter),
    ('^/api/properties', ApiPropertiesRouter),
    ('^/api.*',          ApiErrorRouter),

    # Catch-all
    ('/.*',     ErrorRouter),
], debug=False)

#application.error_handlers[500] = handle_500
