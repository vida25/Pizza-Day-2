import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../api/groups_collection.js';
import { Events } from '../../../api/events/events_collection.js';
import { eventExist } from '../../components/components.js';
import './group_room.html';
import '../nav_bar/right_nav_bar/right_nav_bar_groups.js';
import './change_logotype/change_logotype.js';
import './add_remove_users/add_remove_users.js';
import './modify_menu/modify_menu.js';
import './inf_about_the_group/inf_about_the_group.js';
import './create_event/create_event.js';
import './discount/discount.js';
import './order/order.js';
import { ordersLocal } from './order/order.js';
import { discountLocal } from './discount/discount.js';
import { isOwner } from '../../components/components.js';

Template.group_room.onCreated(function onGroup_roomCreated() {
	this.templateName = new ReactiveVar('create_event');
	this.allUsers = new ReactiveVar(null);
	this.lastState = false;
});

Template.group_room.helpers({
	'templateConfig': function() {
		let instance = Template.instance();
		let curState = eventExist(Groups,instance.data);
		let t = instance.templateName.get();
		let tmplName = (instance.lastState == curState)?(t):('create_event');
		instance.lastState = curState;
				return {'name': tmplName,	'groupName': instance.data}
	},
	'currentGroup': function() {
		return Groups.findOne({'groupName': Template.instance().data});
	},
	'add_remove_users_config': function() {
		let instance = Template.instance();
		if(instance.allUsers.get() !== null)
			return {
				all_users: instance.allUsers.get(),
				groupName: instance.data,
			}
	}
});

Template.group_room.events({
	'click .logotype': function(e) {
		if(isOwner(Groups, Template.instance().data, Meteor.userId()))
			Template.instance().$('#select_logo').modal('show');
	},
	'click #add_remove_users': function(e) {
		let instance = Template.instance();
			Meteor.call('all_users', Meteor.userId(), instance.data, function(e, r) {
				if(r)		instance.allUsers.set(r);
				else		throw new Meteor.Error(e);
			});
		instance.$('#m_users_group_config').modal('show');
	},
	'click .menu_items': function(e) {
		Template.instance().templateName.set(Template.instance().$(e.target).data('name'));
	},
	'click #make_order_menu': function(e) {
		ordersLocal.orders.splice(0,ordersLocal.orders.length);
		Template.instance().templateName.set('order');
	},
	'click #add_discount_menu': function(e) {
		discountLocal.discounts.splice(0,discountLocal.discounts.length);
		Template.instance().templateName.set('discount');
	},
	'click #remove_event': function(e) {
		if(confirm('Are you sure you want to remove event?')) {
			Meteor.call('remove_event', Meteor.userId(), Template.instance().data);
			Template.instance().templateName.set('create_event');
		}
	},
	'click #remove_group': function(e) {
		if(confirm('Are you sure you want to remove group?')) {
			Meteor.call('remove_groups', Meteor.userId(), Template.instance().data);
		}
	}
});