import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../../../api/groups_collection.js';
import './your_groups.html';
import './group/group.js';

	Template.your_groups.onCreated(function onYour_groupsCreated() {

	});

	Template.your_groups.onRendered(function onYour_groupsRendered() {

	});

	Template.your_groups.onDestroyed(function onYour_groupsDestroyed() {

	});

	Template.your_groups.helpers({
		yourGroups: function() {
			let yourGroups = Groups.find({'owner._id': Meteor.userId()}).fetch();
				if(yourGroups) return yourGroups.map(( group ) => {
					group.countUsers = group.users.length + 1;
					return group;
				});
		}
	});

	Template.your_groups.events({

	});


