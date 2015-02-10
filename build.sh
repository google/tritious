#!/bin/bash

ember build --environment production && \
cp -rv dist/* ../server/ember/
