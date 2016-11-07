import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../../../api/groups_collection.js';
import './modify_menu_item.html';
import './modify_menu_item.css';
import { checkTheValue }  from '../../../../components/regExp.js';
import { style_succes_danger } from '../../../../components/style_success_danger.js';


Template.modify_menu_item.onCreated(function onModify_menu_itemCreated() {
	this.modify = new ReactiveVar(false);
	this.itemNameAllow = new ReactiveVar(false);
	this.priceAllow = new ReactiveVar(false);
	this.textareaAllow = new ReactiveVar(false);
});

Template.modify_menu_item.onRendered(function onModify_menu_itemRendered() {

});

Template.modify_menu_item.onDestroyed(function onModify_menu_itemDestroyed() {

});

Template.modify_menu_item.helpers({
	'modify': function() {
		return Template.instance().modify.get();
	},
	'show_save_button': function() {
		let instance = Template.instance();
		return (instance.itemNameAllow.get() && instance.priceAllow.get() && instance.textareaAllow.get());
	}
});

Template.modify_menu_item.events({
	'click .modify_menu_item': function(e) {
		let instance = Template.instance();
		instance.modify.set(!instance.modify.get());
	},
	'click .remove_menu_item': function(e) {
		const groupName = Template.parentData(1);
		let group = Groups.findOne({groupName});
		const menuId = group.menuId;
		const itemName = this.itemName;
		const price = this.itemPrice;
		const description = this.itemDescription;
			Meteor.call('update_menu', Meteor.userId(), groupName, menuId, itemName, price, description, 'pull');
	},
	'click button[name=cancel]': function(e) {
		let instance = Template.instance();
		instance.modify.set(!instance.modify.get());
	},
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
	'click button[name=save_modified]': function(e) {
		e.preventDefault();
		let instance = Template.instance();
		instance.modify.set(!instance.modify.get());
		if( instance.itemNameAllow.get() && instance.priceAllow.get() && instance.textareaAllow.get() ) {
			const groupName = Template.parentData(1);
			const menuId = Groups.findOne({'groupName': groupName}).menuId;
			const itemName = instance.$('input[name=itemName]').val();
			const price = instance.$('input[name=price]').val();
			const description = instance.$('textarea').val();
			const oldItemName = this.itemName;
			console.log('oldItemName', oldItemName);
			 // ownerId, groupName, menuId, itemName, price, description, action
			Meteor.call('update_menu', Meteor.userId(), groupName, menuId, itemName, price, description, 'set', oldItemName);
		}
	}
});
