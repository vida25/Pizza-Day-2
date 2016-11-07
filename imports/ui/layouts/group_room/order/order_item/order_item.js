import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './order_item.html';
import { ordersLocal } from '../order.js';
import { checkTheValue } from '../../../../components/regExp.js';
import { buttonStyle } from '../../../../components/components.js';
import { indexOfItem } from '../../../../components/components.js';
import { Events } from '../../../../../api/events/events_collection.js';

Template.order_item.onCreated(function onOrder_itemCreated() {

});

Template.order_item.onRendered(function onOrder_itemRendered() {

});

Template.order_item.onDestroyed(function onOrder_itemDestroyed() {

});

Template.order_item.helpers({
	'event_ordering': function() {
		let event = Events.findOne({groupName: Template.parentData(1)});
		if(event) return event.status === 'ordering';
		return false;
	}
});

Template.order_item.events({
	'click .item_to_order': function(e) {
		let instance = Template.instance();
		let btn = instance.$(e.target);
		let order_count = instance.$('.order_count');
		let index = indexOfItem(ordersLocal.orders, instance.data);
		if (index === -1) {
			let count = order_count.val();
			if (checkTheValue('count',count)) {
				instance.data.count = +count;
				ordersLocal.orders.push(instance.data);
			}
		}	else  ordersLocal.orders.splice(index, 1);
		buttonStyle(btn, order_count);
	},
	'input .order_count': function(e) {
		let target = $(e.target);
		if(!checkTheValue('count',target.val()))
			target.addClass('bg-danger');
		else target.removeClass('bg-danger');
	}
});