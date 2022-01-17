.PHONY: all test clean

install:
	npm install

test:  
	npm test

start:
	node server.js