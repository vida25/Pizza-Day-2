import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../../../api/groups_collection.js';
import './add_menu_item.html';
import './add_menu_item.css';
import { checkTheValue }  from '../../../../components/regExp.js';
import { style_succes_danger } from '../../../../components/style_success_danger.js';

Template.add_menu_item.onCreated(function onAdd_menu_itemCreated() {
	this.itemNameAllow = new ReactiveVar(false);
	this.priceAllow = new ReactiveVar(false);
	this.textareaAllow = new ReactiveVar(false);
});

Template.add_menu_item.helpers({
	'show_save_button': function() {
		let instance = Template.instance();
		return (instance.itemNameAllow.get() && instance.priceAllow.get() && instance.textareaAllow.get());
	}
});

Template.add_menu_item.events({
	'input input[name=itemName]': function(e) {
		let instance = Template.instance();
		let value = e.target.value;
		instance.itemNameAllow.set( style_succes_danger( e.target, checkTheValue('menuItem',value) ) );
	},
	'input input[name=price]': function(e) {
		let instance = Template.instance();
		let value = e.target.value;
		instance.priceAllow.set( style_succes_danger( e.target, checkTheValue('price',value) ) );
	},
	'input textarea': function(e) {
		let instance = Template.instance();
		let value = e.target.value;
		instance.textareaAllow.set( style_succes_danger ( e.target, (value.length < 50 && value.length > 10) ) );
	},
	'click button[name=save_menu_item]': function(e) {
		e.preventDefault();
		let instance = Template.instance();
		if( instance.itemNameAllow.get() && instance.priceAllow.get() && instance.textareaAllow.get() ) {
			const groupName = this.groupName;
			const menuId = Groups.findOne({'groupName': groupName}).menuId;
			const itemName = instance.$('input[name=itemName]').val();
			const price = instance.$('input[name=price]').val();
			const description = instance.$('textarea').val();
			 // ownerId, groupName, menuId, itemName, price, description, action
			Meteor.call('update_menu', Meteor.userId(), groupName, menuId, itemName, price, description, 'push');
		}
	}
});
