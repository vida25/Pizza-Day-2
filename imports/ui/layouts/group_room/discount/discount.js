import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Menu } from '../../../../api/menu_collection.js';
import { Groups } from '../../../../api/groups_collection.js';
import { Events } from '../../../../api/events/events_collection.js';
import './discount.html';
import './discount_item/discount_item.js';
import './discounted_item/discounted_item.js';
export const discountLocal = {discounts:[]};

Template.discount.onCreated(function onDiscountCreated() {
	this.subscribe('menu');
	this.discounted_items = new ReactiveVar([]);
});

Template.discount.onRendered(function onDiscountRendered() {

});

Template.discount.onDestroyed(function onDiscountDestroyed() {

});

Template.discount.helpers({
	'items': function() {
		let groupName = Template.instance().data;
		let menu = Menu.findOne({groupName: groupName});
			if(menu) {
				let group = Groups.findOne({groupName: groupName});
				let allowRemoveItem = ( group.owner._id === Meteor.userId() );
				let menuItems = menu.menu.map(( menuItem ) => {
						return {'itemName': menuItem.itemName,
										'itemPrice': menuItem.itemPrice.toFixed(2),
										'itemDescription': menuItem.itemDescription,
										'allowRemoveItem': allowRemoveItem	}
				});
				return menuItems;
			}
	},
	'discounted_items': function() {
		let instance = Template.instance();
		let event = Events.findOne({groupName: instance.data});
			if(!event) return false;
		let discounted_items = event.orders.filter(( order ) => {
			return order.discount !== 0;
		}).map(( order ) => {
				return {'itemName': order.itemName,
								'itemPrice': order.itemPrice.toFixed(2),
								'itemDescription': order.itemDescription,
								'count': order.discount}
			});
		instance.discounted_items.set(discounted_items);
		return discounted_items;
	}
});

Template.discount.events({
	'click #add_discount': function(e) {
			let discounts = discountLocal.discounts.map( function( discount ) {
				return {
					count: discount.count,
					itemName: discount.itemName
				}
			});
			Meteor.call('update_event_discount', Meteor.userId(), Template.instance().data, discounts);
	},
	'click #cancel_discount': function(e) {
			let discounts = Template.instance().discounted_items.get().map( function( discount ) {
						return {
							itemName: discount.itemName,
							count: 0
						}
			});
			Meteor.call('update_event_discount', Meteor.userId(), Template.instance().data, discounts);
	}
});