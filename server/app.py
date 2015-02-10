#!/usr/bin/env python
import webapp2
import logging
import json

from google.appengine.ext import ndb

from player import *

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


class ApiMapRouter(webapp2.RequestHandler):
    def get(self, map_id):
        if(map_id == "main"):
            print_json(self, {
                "test": "hi",

                # The array of tiles
                "map": [
                    ["rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
                    ["rock",  "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock",  "grass", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "grass", "rock"],
                    ["rock",  "grass", "grass", "grass", "grass", "grass", "rock",  "rock",  "grass", "rock"],
                    ["rock",  "rock",  "rock",  "rock",  "grass", "grass", "grass", "rock",  "grass", "rock"],
                    ["rock",  "rock",  "rock",  "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock",  "grass", "grass", "grass", "grass", "rock",  "rock",  "rock",  "rock",  "rock"],
                    ["rock",  "grass", "grass", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
                    ["rock",  "grass", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
                    ["rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
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
                "tiles": {
                  "grass": {
                      "img":      "img/grass.png",
                      "passable": True,
                  },
                  "rock": {
                      "img":      "img/rock.png",
                      "passable": False,
                  },
                  "404": {
                      "img":      "img/404.png",
                      "passable": False,
                  },
               }
            })
        elif(map_id == "map2"):
             print_json(self, {
                "test": "hi",

                # The array of tiles
                "map": [
                    ["rock", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "rock"],
                    ["rock", "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock",  "rock"],
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
                "tiles": {
                  "grass": {
                      "img":      "img/grass.png",
                      "passable": True,
                  },
                  "rock": {
                      "img":      "img/rock.png",
                      "passable": False,
                  },
                  "404": {
                      "img":      "img/404.png",
                      "passable": False,
                  },
               }
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

class ApiNpcRouter(webapp2.RequestHandler):
    def get(self, id):
        result = {}

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
    ('^/api/map/(\w+)',  ApiMapRouter),
    ('^/api/npc/(\w+)',  ApiNpcRouter),

    ('^/api/register',   ApiRegisterRouter),
    ('^/api/properties', ApiPropertiesRouter),
    ('^/api.*',          ApiErrorRouter),

    # Catch-all
    ('/.*',     ErrorRouter),
], debug=False)

#application.error_handlers[500] = handle_500