import { Router } from 'meteor/iron:router';
import { Groups } from '../../../api/groups_collection.js';
import '../../../ui/layouts/group_room/group_room.js';
import '../../../ui/layouts/not_found/not_found.js'

Router.route('group_room', {
	'path': '/group_room/:groupName',
	'template': 'group_room',
	'data': function() {
		return this.params.groupName;
	},
	'onBeforeAction': function() {
		let groupName = this.params.groupName;
		let config = [ {'groupName': groupName, 'owner._id': Meteor.userId()},
									 {'groupName': groupName, 'users': Meteor.userId()} ];
		if(Groups.findOne({'$or': config}) === undefined)
			this.redirect('not_found');
		this.next();
	},
	waitOn:function() {
		return Meteor.subscribe('groups');
	}
});
