import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../../../api/groups_collection.js';
import './groups_you_invited_to.html';

Template.groups_you_invited_to.onCreated(function onGroups_you_invited_toCreated() {

});

Template.groups_you_invited_to.onRendered(function onGroups_you_invited_toRendered() {

});

Template.groups_you_invited_to.onDestroyed(function onGroups_you_invited_toDestroyed() {

});

Template.groups_you_invited_to.helpers({
	groups_you_invited_to: function() {
		let groups_you_invited_to = Groups.find({users: Meteor.userId()}).fetch();
			return groups_you_invited_to.map(( group ) => {
				group.countUsers = group.users.length + 1;
				return group;
			});
	}
});

Template.groups_you_invited_to.events({

});