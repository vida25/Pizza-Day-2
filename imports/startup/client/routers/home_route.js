import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { Groups } from '../../../api/groups_collection.js';
import '../../../ui/layouts/home/home.js';
import '../../../ui/layouts/pizza_day/pizza_day.js';

Router.route('home', {
	'path': '/home/:limit?',
	'template': 'home',
	'data': function() {
			let limit = this.params.limit;
	},
	waitOn: function() {
		return Meteor.subscribe('groups');
	}
});
