import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../../../api/groups_collection.js';
import { Menu } from '../../../../api/menu_collection.js';
import './modify_menu.html';
import './modity_menu_item/modify_menu_item.js';
import './add_menu_item/add_menu_item.js';

Template.modify_menu.onCreated(function onModify_menuCreated() {
	this.subscribe('menu');
});

Template.modify_menu.onRendered(function onModify_menuRendered() {

});

Template.modify_menu.onDestroyed(function onModify_menuDestroyed() {

});

Template.modify_menu.helpers({
	'groupName': function() {
		let groupName = Template.instance().data;
		return {'groupName': groupName};
	},
	'menuItems': function() {
		let groupName = Template.instance().data;
		let menu = Menu.findOne({groupName: groupName});
			if(menu) {
				let group = Groups.findOne({groupName: groupName});
				let allowRemoveItem = ( group.owner._id === Meteor.userId() );
				let menuItems = menu.menu.map(( menuItem ) => {
						return {'itemName': menuItem.itemName,
										'itemPrice': menuItem.itemPrice.toFixed(2),
										'itemDescription': menuItem.itemDescription,
										'allowRemoveItem':allowRemoveItem	}
				});
				return menuItems;
			}
	}
});

Template.modify_menu.events({

});
