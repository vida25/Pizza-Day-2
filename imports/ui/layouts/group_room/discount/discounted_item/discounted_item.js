import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { checkTheValue } from '../../../../components/regExp.js';
import './discounted_item.html';

Template.discounted_item.onCreated(function onDiscounted_itemCreated() {

});

Template.discounted_item.onRendered(function onDiscounted_itemRendered() {

});

Template.discounted_item.onDestroyed(function onDiscounted_itemDestroyed() {

});

Template.discounted_item.helpers({

});

Template.discounted_item.events({
	'click .item_to_discount': function(e) {
		Template.instance().data;
		Meteor.call('update_event_discount',
				Meteor.userId(),
				Template.parentData(1),
				[{itemName: Template.instance().data.itemName, count: 0}]
			);
	}
});