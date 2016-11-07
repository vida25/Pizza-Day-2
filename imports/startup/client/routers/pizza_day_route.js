import { Router } from 'meteor/iron:router';
import '../../../ui/layouts/pizza_day/pizza_day.js';
import '../../../ui/layouts/not_found/not_found.js'

Router.route('pizza_day', {
	'path': '/pizza_day/:name?',
	'template': 'pizza_day',
	'data': function() {

	},
	waitOn: function() {
		return Meteor.subscribe('groups');
	}
});