'use strict';

const Backbone		= require('backbone');
const Router		= require('./js/router.js');

class SocketIOTester {
	constructor() {
		this.router = new Router();
		Backbone.history.start();
	}
}

const app = new SocketIOTester();
