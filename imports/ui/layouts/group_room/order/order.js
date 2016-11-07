import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Menu } from '../../../../api/menu_collection.js';
import { Groups } from '../../../../api/groups_collection.js';
import { Events } from '../../../../api/events/events_collection.js';
import './order.html';
import './order_item/order_item.js';
import './ordered_item/ordered_item.js';
import { pushPullOrder } from '../../../components/components.js';
export const ordersLocal = {orders: []};

Template.order.onCreated(function onOrderCreated() {
	this.subscribe('menu');
	this.discount = new ReactiveVar(0);
	this.total_to_pay = new ReactiveVar(0);
	this.order_completed = new ReactiveVar([]);
});

Template.order.helpers({
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
										'allowRemoveItem':allowRemoveItem	}
				});
				return menuItems;
			}
	},
	'order_completed': function() {
		let instance = Template.instance();
		let event = Events.findOne({groupName: instance.data});
			if(!event) return;
		let total_to_pay = 0;
		let discount = 0;
		let order_completed = event.orders.filter(( order ) => {
			return order.customers.some( (c)=>{return c._id === Meteor.userId() && c.count > 0} );
		}).map(( menuItem ) => {
				let total_count = menuItem.customers.reduce( (a,b)=>{return a+b.count},0 );
				let user = menuItem.customers.find( (c)=>{return c._id === Meteor.userId()} );
				if(menuItem.discount > 0) discount += (menuItem.discount*menuItem.itemPrice*user.count)/total_count;
				total_to_pay += user.count * menuItem.itemPrice;
				return {'itemName': menuItem.itemName,
								'itemPrice': menuItem.itemPrice.toFixed(2),
								'itemDescription': menuItem.itemDescription,
								'discount': menuItem.discount,
								'count': user.count}
			});
			instance.total_to_pay.set(((total_to_pay - discount).toFixed(2)));
			instance.discount.set(discount.toFixed(2));
			instance.order_completed.set(order_completed);
			return order_completed;
	},
	'total_to_pay': function() {
		return Template.instance().total_to_pay.get();
	},
	'discount': function() {
		return Template.instance().discount.get();
	},
	'event_ordering': function() {
		let event = Events.findOne({groupName: Template.instance().data});
		if(event) return event.status === 'ordering';
		return false;
	}
});

Template.order.events({
	'click #make_order': function(e) {
		pushPullOrder(ordersLocal.orders, Template.instance().data,'push');
	},
	'click #cancel_ordered': function(e) {
		let instance = Template.instance();
		pushPullOrder(instance.order_completed.get(), instance.data,'pull');
	}
});

