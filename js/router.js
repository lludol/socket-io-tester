'use strict';

const Backbone 			= require('backbone');
const HomeView 			= require('./views/home.js');
const SocketTesterView 	= require('./views/socketTester.js');
const $					= require('jquery');

class Router extends Backbone.Router {
	constructor() {
		const options = {
			routes: {
				'': 				'home',
				'socket_tester':	'socketTester'
			}
		};
		super(options);
	}

	home() {
		const homeView = new HomeView();
		homeView.render();
		$('#view').empty().append(homeView.$el);
	}

	socketTester() {
		const socketTesterView = new SocketTesterView();
		socketTesterView.render();
		$('#view').empty().append(socketTesterView.$el);
	}
}

module.exports = Router;
