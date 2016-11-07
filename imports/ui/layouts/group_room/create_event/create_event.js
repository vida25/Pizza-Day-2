import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Events } from '../../../../api/events/events_collection.js';
import { Groups } from '../../../../api/groups_collection.js';
import { checkTheValue } from '../../../components/regExp.js';
import { isOwner } from '../../../components/components.js';
import { eventExist } from '../../../components/components.js';
import './create_event.html';

Template.create_event.onCreated(function onCreate_eventCreated() {
	this.subscribe('events');
	this.allowed_send_email = new ReactiveVar(false);
	this.allow = new ReactiveVar(false);
	this.default = new ReactiveVar(false);
});

Template.create_event.onRendered(function onCreate_eventRendered() {

});

Template.create_event.onDestroyed(function onCreate_eventDestroyed() {

});

Template.create_event.helpers({
	'is_owner': function() {
		return isOwner(Groups, Template.instance().data, Meteor.userId());
	},
	'groupName': function() {
		return Template.instance().data;
	},
	'event_exist': function() {
		return eventExist(Groups, Template.instance().data);
	},
	'current_status': function() {
		let event = Events.findOne({groupName: Template.instance().data});
		if(event)	return event.status;
		return false;
	},
	'allowed_send_email': function() {
		return Template.instance().allowed_send_email.get();
	},
	success: function() {
		return Template.instance().allow.get();
	},
	'default': function() {
		return Template.instance().default.get();
	},
	'subscribed': function() {
		let event = Events.findOne({groupName: Template.instance().data});
		if(event)	return event.subscribers.some((sub)=>{return sub.userId === Meteor.userId() && sub.subscribed === true});
	},
	'status_delivered': function() {
		let event = Events.findOne({groupName: Template.instance().data});
		if(event) return event.status == 'delivered';
	}
});

Template.create_event.events({
	'click #create_event': function(e) {
		let groupName = Template.instance().data;
		Meteor.call('create_event', Meteor.userId(), groupName);
	},
	'click #change_status_btn': function(e) {
		let event = Events.findOne({groupName: Template.instance().data});
		Meteor.call('change_event_status', Meteor.userId(), Template.instance().data, event.status);
	},
	'click #allow_send_email': function(e) {
		let instance = Template.instance();
		instance.allowed_send_email.set(!instance.allowed_send_email.get());
	},
	'input #input_password_email': function(e) {
		let instance = Template.instance();
		if (checkTheValue('password', e.target.value)) {
			if(!instance.default.get()) instance.default.set(true);
				instance.allow.set(true);
		} else 	instance.allow.set(false);
	},
	'click #send_email': function(e) {
		let instance = Template.instance();
		let pass = instance.$('#input_password_email').val();
		let group = Groups.findOne({groupName: instance.data});
			Meteor.call('sendEmail', Meteor.userId(), group.owner.email, pass, instance.data);
	},
	'click #subscribe_event': function(e) {
		Meteor.call('subscribe_event', Meteor.userId(), Template.instance().data);
	}
});