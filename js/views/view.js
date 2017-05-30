const Backbone = require('backbone');
const fs = require('fs');
const Handlebars = require('handlebars');

/**
 * View is a wrapper of Backbone.View.
 */
class View extends Backbone.View {
	/**
	 * Load the template file.
	 * @param {String} templatePath - The path.
	 */
	initializeTemplate(templatePath) {
		this.template = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'));
	}
}

module.exports = View;
