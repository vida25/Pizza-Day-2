import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './remove_user.html';

Template.remove_user.onCreated(function onRemove_userCreated() {

});

Template.remove_user.onRendered(function onRemove_userRendered() {

});

Template.remove_user.onDestroyed(function onRemove_userDestroyed() {

});

Template.remove_user.helpers({

});

Template.remove_user.events({
	'click button[name=removeUser]': function(e) {
		let _id = this._id;
		let groupName = this.groupName;
		Meteor.call('add/remove_user', Meteor.userId(), groupName, _id, 'pull');
	}
});