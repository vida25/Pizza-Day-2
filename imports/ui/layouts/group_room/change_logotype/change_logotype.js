import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './change_logotype.html';
import './logotype/logotype.js';
import { check } from 'meteor/check';

Template.change_logotype.onCreated(function onChange_logotypeCreated() {
		this.logotypes = new ReactiveVar([
			{src: '/img/menuPizzaDay/algo.png'},
			{src: '/img/menuPizzaDay/android.png'},
			{src: '/img/menuPizzaDay/breckets.png'},
			{src: '/img/menuPizzaDay/default.jpg'},
			{src: '/img/menuPizzaDay/egg.jpg'},
			{src: '/img/menuPizzaDay/js.jpg'},
			{src: '/img/menuPizzaDay/minion.jpg'},
			{src: '/img/menuPizzaDay/PIZZA.png'},
			{src: '/img/menuPizzaDay/pizza_100.png'},
			{src: '/img/menuPizzaDay/pizza_hut.png'},
			{src: '/img/menuPizzaDay/smile.jpg'},
		]);
		this.currentLogoIndex = new ReactiveVar(null);
		this.allLogotypes = new ReactiveVar(null);
});

Template.change_logotype.helpers({
	logotypes: function() {
		let logotypes = Template.instance().logotypes.get();
		return logotypes.map((elem, index) => {
			elem.value = index;
			return elem;
		});
	},
});

Template.change_logotype.events({
	'click .select-logo': function(e) {
		let instance = Template.instance();
		let target = instance.$(e.target);
			if(instance.allLogotypes.get() === null)
				instance.allLogotypes.set($('.select-logo'));
		instance.allLogotypes.get().not(target).css({'border': 'none'});
		target.css({'border': '1px solid blue'});
		instance.currentLogoIndex.set( Number(target.data('value')) );

	},
	'click #save_logo': function(e) {
		let instance =  Template.instance()
		let index = instance.currentLogoIndex.get();
			if(index === null) {
				alert('select some logotypes first');
				return;
			}
		let srcObj = Template.instance().logotypes.get()[index];
			check(srcObj, Object);
		let groupName = this.groupName;
		Meteor.call('updateLogo', Meteor.userId(), groupName, srcObj.src);
		instance.$('#select_logo').modal('hide');
	}
});