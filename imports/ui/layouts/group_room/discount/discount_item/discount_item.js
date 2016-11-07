import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './discount_item.html' ;
import { discountLocal } from '../discount.js';
import { checkTheValue } from '../../../../components/regExp.js';
import { buttonStyle } from '../../../../components/components.js';
import { indexOfItem } from '../../../../components/components.js';

Template.discount_item.onCreated(function onDiscount_itemCreated() {

});

Template.discount_item.onRendered(function onDiscount_itemRendered() {

});

Template.discount_item.onDestroyed(function onDiscount_itemDestroyed() {

});

Template.discount_item.helpers({

});

Template.discount_item.events({
	'click .item_to_discount': function(e) {
		let instance = Template.instance();
		let btn = instance.$(e.target);
		let input_elem = instance.$('.discount_count');
		let index = indexOfItem(discountLocal.discounts, instance.data);
		if (index === -1) {
			let count = input_elem.val();
			if (checkTheValue('count',count)) {
				instance.data.count = +count;
				discountLocal.discounts.push(instance.data);
			}
		}	else  discountLocal.discounts.splice(index, 1);
		buttonStyle(btn,input_elem);
	},
	'input .discount_count': function(e) {
		let target = $(e.target);
		if(!checkTheValue('count',target.val()))
			target.addClass('bg-danger');
		else target.removeClass('bg-danger');
	}
});

