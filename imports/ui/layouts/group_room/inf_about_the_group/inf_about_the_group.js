import './inf_about_the_group.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../../api/groups_collection.js';
import { Events } from '../../../../api/events/events_collection.js';

Template.inf_about_the_group.onCreated(function onInf_about_the_groupCreated() {
	this.subscribe('events');
});

Template.inf_about_the_group.onRendered(function onInf_about_the_groupRendered() {

});

Template.inf_about_the_group.onDestroyed(function onInf_about_the_groupDestroyed() {

});

Template.inf_about_the_group.helpers({
	'usersInGroup': function() {
		let groupName = this.groupName;
		let group = Groups.findOne({groupName});
		if(group) return group.users.length + 1;
	},
	'subscribersInEvent': function() {
		let groupName = this.groupName;
		let event = Events.findOne({groupName});
		if(event) return event.subscribers.filter(( subscriber )=>{
			return subscriber.subscribed === true;
		}).length;
	},
	'eventStatus': function() {
		let groupName = this.groupName;
		let event = Events.findOne({groupName});
		if(event) return event.status;
	},
	'owner': function() {
		let groupName = this.groupName;
		let group = Groups.findOne({groupName});
		if(group) 	return group.owner._id === Meteor.userId();
	}
});

Template.inf_about_the_group.events({

});