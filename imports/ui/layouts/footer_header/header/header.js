import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import './header.html';
import './nav_item/nav_item.js';

Template.header.onCreated(function onHeaderCreated() {

});

Template.header.onRendered(function onHeaderRendered() {

});

Template.header.onDestroyed(function onHeaderDestroyed() {

});

Template.header.helpers({
	'left_side': function() {
		return [
			{templateName: 'home', text: 'Home'}
		]
	},
	'right_side': function() {
		return [
			{templateName: 'pizza_day', text: 'Pizza Day'}
		]
	}
});

