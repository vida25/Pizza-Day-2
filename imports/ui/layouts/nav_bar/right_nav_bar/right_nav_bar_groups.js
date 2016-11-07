	import { Meteor } from 'meteor/meteor';
	import { Template } from 'meteor/templating';
	import { isOwner } from '../../../components/components.js';
	import { Groups } from '../../../../api/groups_collection.js';
	import { Events } from '../../../../api/events/events_collection.js';
	import './right_nav_bar_groups.html';
	import './right_nav_bar_groups.css';
	import { eventExist } from '../../../components/components.js';
	Template.right_nav_bar_groups.onCreated(function onRight_nav_bar_groupsCreated() {

	});

	Template.right_nav_bar_groups.onRendered(function onRight_nav_bar_groupsRendered() {

	});

	Template.right_nav_bar_groups.onDestroyed(function onRight_nav_bar_groupsDestroyed() {

	});

	Template.right_nav_bar_groups.helpers({
		'event_sub': function() {
			if(Template.instance().data) {
				let event = Events.findOne({groupName: Template.instance().data.groupName});
				if(event)	return 	event.subscribers.some((sub)=>{return sub.userId === Meteor.userId() && sub.subscribed === true});
			}
		},
		'is_owner': function() {
			if(Template.instance().data)
				return isOwner(Groups, Template.instance().data.groupName, Meteor.userId());
			return false;
		},
		'event_exist': function() {
			if(Template.instance().data)
				return eventExist(Groups, Template.instance().data.groupName );
			return false;
		}
	});

	Template.right_nav_bar_groups.events({

	});