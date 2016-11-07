import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Router } from 'meteor/iron:router';
import './pizza_day.css';
import './pizza_day.html';
import '../nav_bar/left_nav_bar/left_nav_bar_groups.js';

Template.pizza_day.onCreated(function onPizzaDayCreated() {
	this.templateName = new ReactiveVar({name: 'your_groups'});
});

Template.pizza_day.onRendered(function onPizzaDayRendered() {

});

Template.pizza_day.onDestroyed(function onPizzaDayDestroyed() {

});


Template.pizza_day.helpers({
	templateConfig() {
		return Template.instance().templateName.get();
	}
});

Template.pizza_day.events({
	'click #left_nav_bar_pizza_day a': function(e) {
		e.preventDefault();
		let instance = Template.instance();
		let name = instance.$(e.target).data(name).name;
			instance.templateName.set({name: name});
	}
});
