	import { Meteor } from 'meteor/meteor';
	import { Template } from 'meteor/templating';
	import { Groups } from '../../../../api/groups_collection.js';
	import './add_remove_users.html';
	import './add_users/add_users.js';
	import './remove_users/remove_users.js';

	Template.add_remove_users.onCreated(function onAdd_remove_usersCreated() {
		Meteor.subscribe('groups');
	});

	Template.add_remove_users.onRendered(function onAdd_remove_usersRendered() {

	});

	Template.add_remove_users.onDestroyed(function onAdd_remove_usersDestroyed() {

	});

	Template.add_remove_users.helpers({
		users_you_can_add_to: function() {
			let all_users = this.all_users;
			let groupName = this.groupName;
			let curGroup = Groups.findOne({
				'groupName': groupName,
				'owner._id': Meteor.userId(),
			});
			if(all_users && curGroup) {
				usersSubscribed = curGroup.users;
				usersSubscribed.push(Meteor.userId());
					return all_users.filter( (user, index) => {
						return usersSubscribed.indexOf(user._id) === -1
					})
					.map( (user, index) => {
						user.groupName = groupName;
						return user;
					})
			}
		},
		users_you_can_del_from: function() {
			let all_users = this.all_users;
			let groupName = this.groupName;
			let curGroup = Groups.findOne({
				'groupName': groupName,
				'owner._id': Meteor.userId(),
			});
			if(all_users && curGroup) {
				usersSubscribed = curGroup.users;
					return all_users.filter( (user, index) => {
						return usersSubscribed.indexOf(user._id) !== -1
					})
					.map( (user, index) => {
						user.groupName = groupName;
						return user;
					})
			}
		}

	});

	Template.add_remove_users.events({
		'click button': function(e) {

		}
	});