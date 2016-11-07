import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import './nav_item.html';

Template.navItem.onCreated(function onNavItemCreated() {

});

Template.navItem.onRendered(function onNavItemRendered() {

});

Template.navItem.onDestroyed(function onNavItemDestroyed() {

});

Template.navItem.helpers({

});

Template.navItem.events({
	'click a': function(e) {
		e.preventDefault();
		let templateName = this.templateName.split('/');
		Router.go(templateName[0], {name: (templateName[1]?templateName[1]:'')});
	}
});