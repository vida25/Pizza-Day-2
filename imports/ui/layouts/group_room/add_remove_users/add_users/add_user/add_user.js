import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './add_user.html';

Template.add_user.onCreated(function onAdd_userCreated() {

});

Template.add_user.onRendered(function onAdd_userRendered() {

});

Template.add_user.onDestroyed(function onAdd_userDestroyed() {

});

Template.add_user.helpers({

});

Template.add_user.events({
	'click button[name=addUser]': function(e) {
		let _id = this._id;
		let groupName = this.groupName;
		// console.log('_id', _id);
		// console.log('groupName', groupName);
		Meteor.call('add/remove_user', Meteor.userId(), groupName, _id, 'push');
	}
});