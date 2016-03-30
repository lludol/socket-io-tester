'use strict';

const Backbone		= require('backbone');
const configstore	= require('./../configStore.js');
const HostModel		= require(__dirname + '/../models/host.js');
const validator		= require('validator');
const View			= require('./view.js');

class HomeView extends View {
	constructor() {
		super({
			events: {
				'click #buttonConnection': 'clickButtonConnection'
			}
		});
		this.initializeTemplate(__dirname + '/../templates/home.hbs');
	}

	clickButtonConnection(e) {
		e.preventDefault();
		const data = {
			host: $('#inputHost').val(),
			port: $('#inputPort').val()
		};
		if (validator.isURL(data.host) && validator.isNumeric(data.port)) {
			if (!data.host.startsWith('http://') && !data.host.startsWith('https://')) {
				data.host = 'http://' + data.host;
			}
			configstore.set('host', new HostModel(data));
			Backbone.history.navigate('socket_tester', true);
		}
	}

	render() {
		this.$el.html(this.template());
	}
}

module.exports = HomeView;
