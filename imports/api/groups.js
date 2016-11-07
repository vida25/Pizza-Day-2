import { Meteor } from 'meteor/meteor';
import { Menu } from './menu_collection.js';
import { check } from 'meteor/check';
import { Groups } from './groups_collection.js';
import { checkTheValue } from '../ui/components/regExp.js';
import { Events } from './events/events_collection.js';
import { isOwner } from '../ui/components/components.js';

Meteor.publish('groups', function() {
	let userId = this.userId;
	if(userId)
		return Groups.find({'$or': [{'owner._id': userId}, {'users': userId}]});
});


Meteor.methods({
	create_group: function( ownerId, groupName ) {
		check(ownerId, Meteor.userId());
		if (!checkTheValue('groupName', groupName) || Groups.findOne({'groupName': groupName}) )
			throw new Meteor.Error('Wrong group\'s name value');
		let currentUser = Meteor.users.findOne({_id: Meteor.userId()});
		let menuId = Menu.insert({'groupName': groupName,	'menu': []});
			Groups.insert({
				'groupName': groupName,
				'owner': {_id: Meteor.userId(), email: currentUser.services.google.email },
				'users': [],
				'img': '/img/menuPizzaDay/default.jpg',
				'menuId': menuId,
				'eventExist': false,
			});
	},
	'add/remove_user': function(ownerId, groupName, userId, action) {
		check(ownerId, Meteor.userId());
		check(groupName, String);
		check(userId, String);
		check(isOwner(Groups, groupName, ownerId), true);
		if(['pull', 'push'].indexOf(action) === -1 )
			throw new Meteor.Error('wrong action type');
		Groups.update({
			groupName: groupName,
			'owner._id': ownerId,
		},{[`$${action}`]: {users: userId}});
	},
	remove_groups: function( ownerId, groupName ) {
		check(ownerId, Meteor.userId());
		check(groupName, String);
		check(isOwner(Groups, groupName, ownerId), true);

		Groups.remove({groupName, 'owner._id': ownerId});
		Events.remove({groupName});
		Menu.remove({groupName});
	},
	'updateLogo': function( ownerId, groupName, src ) {
		check(ownerId, Meteor.userId());
		check(groupName, String);
		check(isOwner(Groups, groupName, ownerId), true);
		Groups.update({groupName}, {'$set': {'img': src}});
	},
	'all_users': function( ownerId, groupName ) {
		check(ownerId, Meteor.userId());
		check(groupName, String);
		check(isOwner(Groups, groupName, ownerId), true);
			let listUsers = Meteor.users.find({}).fetch();
			if(listUsers != null)
				return listUsers.map( function( user ) {
					return {
							userName: user.services.google.name,
							email: user.services.google.email,
							_id: user._id
						}
				});
	},
	'group_exist': function( userId, groupName) {
		check(userId, Meteor.userId());
		check(groupName, String);
		let found = Groups.findOne( {'groupName': groupName} );
			if(found === undefined)
				return false;
			return true;
	},
});





