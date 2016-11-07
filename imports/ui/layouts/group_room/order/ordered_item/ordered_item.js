import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { checkTheValue } from '../../../../components/regExp.js';
import { Events } from '../../../../../api/events/events_collection.js';
import './ordered_item.html';
import { pushPullOrder } from '../../../../components/components.js';

Template.ordered_item.onCreated(function onOrdered_itemCreated() {

});

Template.ordered_item.onRendered(function onOrdered_itemRendered() {

});

Template.ordered_item.onDestroyed(function onOrdered_itemDestroyed() {

});

Template.ordered_item.helpers({
	'event_ordering': function() {
		let event = Events.findOne({groupName: Template.parentData(1)});
		if(event) return event.status === 'ordering';
		return false;
	}
});

Template.ordered_item.events({
	'click .ordered_item': function(e) {
		let data = Template.parentData(0);
		pushPullOrder([{itemName: data.itemName, count: data.count}], Template.parentData(1),'pull');
	}
});
