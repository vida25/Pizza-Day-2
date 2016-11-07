import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { checkTheValue } from '../../ui/components/regExp.js';
import { Events } from './events_collection.js';
import { Groups } from '../groups_collection.js';
import { Menu } from '../menu_collection.js';
import { isOwner } from '../../ui/components/components.js';

Meteor.publish('events', function() {
	let userId = this.userId;
	if(userId) {
		let groups = Groups.find({'$or': [{'owner._id': userId}, {'users': userId}]});
		if(groups)
			return Events.find({'$or': groups.fetch().map((group)=>{return {groupName: group.groupName}})});
	}
});

Meteor.methods({
	'create_event': function( ownerId, groupName ) {
		checkOwnerGrName( ownerId, groupName );
		check(isOwner(Groups, groupName, ownerId), true);
			let groupConfig = {groupName: groupName, 'owner._id': ownerId, eventExist: false};
			let group = Groups.findOne(groupConfig);
		check(group, Object);
			let owner = [{'userId': Meteor.userId(), 'subscribed': true}];
				function subscribersFunc() {
					if(group.users.length > 0) return owner.concat(group.users.map(function( userId ) {
						return {'userId': userId, 'subscribed': null}
					}))
						return owner;
				};
		let menu = Menu.findOne({groupName});
		Groups.update(groupConfig,{'$set': {eventExist: true} });
		Events.insert({
			groupName: groupName,
			date: new Date(),
			subscribers: subscribersFunc(),
			orders: menu.menu.map( function( item ) {
				item.customers = [];
				item.discount = 0;
				return item;
			}),
			status: 'ordering',
		});
	},
	'remove_event': function( ownerId, groupName ) {
		checkOwnerGrName( ownerId, groupName );
		check(isOwner(Groups, groupName, ownerId), true);
		Events.remove({groupName});
		Groups.update({groupName}, {'$set': {'eventExist': false}});
	},
	'update_event_order': function( ownerId, groupName, orders, action ) {
		checkOwnerGrName( ownerId, groupName );
		check(orders, Array);
		check(action, String);
		if(['push', 'pull'].indexOf(action) === -1)
			throw new Meteor.Error('Wrong action!');
		orders.forEach(function( order ) {
			Events.update({'groupName': groupName, 'orders.itemName': order.itemName},{[`$${action}`]: {'orders.$.customers': {'_id': Meteor.userId(), 'count': order.count}}});
		});
	},
	'update_event_discount': function( ownerId, groupName, discounts ) {
			checkOwnerGrName( ownerId, groupName );
			check(isOwner(Groups, groupName, ownerId), true);
			check(discounts, Array);
			discounts.forEach(function( discount ) {
				Events.update({'groupName': groupName, 'orders.itemName': discount.itemName},{'$set': {'orders.$.discount': discount.count}});
			});
		},
	'change_event_status': function( ownerId, groupName, lastStatus) {
		checkOwnerGrName( ownerId, groupName );
		check(isOwner(Groups, groupName, ownerId), true);
		check(lastStatus, String);
		Events.update({'groupName': groupName},{'$set': {status: nextStatus(lastStatus)}});
	},
	'subscribe_event': function( userId, groupName ) {
		checkOwnerGrName( userId, groupName );
		Events.update({groupName: groupName, 'subscribers.userId': userId}, {'$set': {'subscribers.$.subscribed': true}});
	}
});



function checkOwnerGrName( ownerId, groupName ) {
		check(ownerId, Meteor.userId());
		check(groupName, String);
}

function nextStatus(lastStatus) {
	let statusArr = ['ordering', 'ordered', 'delivering', 'delivered'];
	nS = statusArr[statusArr.indexOf(lastStatus)+1];
	check(nS, String);
	return nS;
}