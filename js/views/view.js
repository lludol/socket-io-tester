'use strict';

const Backbone		= require('backbone');
const fs 			= require('fs');
const Handlebars	= require('handlebars');

class View extends Backbone.View {
	constructor(options) {
		super(options);
	}

	initializeTemplate(templatePath) {
		this.template = Handlebars.compile( fs.readFileSync(templatePath, 'utf8') );
	}
}

module.exports = View;
