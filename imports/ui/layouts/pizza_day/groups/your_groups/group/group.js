import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Groups } from '../../../../../../api/groups_collection.js';
import { Events } from '../../../../../../api/events/events_collection.js';
import './group.html';
import '../../../../../../startup/client/routers/group_room_route.js';


Template.group.onCreated(function onGroupCreated() {
	this.subscribe('events');
});

Template.group.onRendered(function onGroupRendered() {

});

Template.group.onDestroyed(function onGroupDestroyed() {

});

Template.group.helpers({
	'event_exist': function() {
		let groupName = this.groupName;
		let group = Groups.findOne({groupName});
		if (group) return group.eventExist;
	},
	'subscribed': function() {
		let groupName = this.groupName;
		let event = Events.findOne({groupName});
		if(event) return event.subscribers.some((sub)=>{return sub.userId === Meteor.userId() && sub.subscribed === true	});
		return false;
	}
});

Template.group.events({
	'click .goToGroup': function(e) {
		e.preventDefault();
		let groupName = this.groupName;
		Router.go('group_room', {groupName});
	},

});