import { Meteor } from 'meteor/meteor';
import { Menu } from './menu_collection.js';
import { Groups } from './groups_collection.js';
import { allow_update_menu } from'../ui/components/check_menu_exist.js';
import { check } from 'meteor/check';
import { isOwner } from '../ui/components/components.js';

Meteor.publish('menu', function() {
	let ownerId = this.userId;
	if(ownerId) {
		let groups = Groups.find({'$or': [{'owner._id': ownerId}, {users: ownerId}]});
		if(groups) {
			let menuIds = groups.fetch().map(( group ) => {return {'_id': group.menuId}});
			return Menu.find({'$or': menuIds});
		}
	}
});

Meteor.methods({
	'update_menu': function(userId, groupName, menuId, itemName, price, description, action, oldItemName) {
			if(allow_update_menu(userId, groupName, menuId, itemName, price, description) &&
					['pull', 'set', 'push'].indexOf(action) !== -1 ) {
				var upConf;
					if(action === 'set') {
						check('oldItemName', String);
						upConf = {'_id': menuId, 'menu.itemName': oldItemName}
						check(Menu.findOne(upConf), Object);
					}	else if(action === 'push') {
						check(Menu.findOne({'_id': menuId, 'menu.itemName': itemName }), undefined);
						upConf = {'_id': menuId};
					} else {
						check(isOwner(Groups, groupName, userId), true);
						check(Menu.findOne({'_id': menuId, 'menu.itemName': itemName }), Object);
						upConf = {'_id': menuId};
					}
				function configUpdate() {
					let selector = (action === 'set')?('menu.$'):('menu');
						return {[`${selector}`]: {
										'itemName': itemName,
										'itemPrice': +price,
										'itemDescription': description,
									}}
				}
				Menu.update(upConf,{[`$${action}`]: configUpdate()});
			}	else {
				 throw new Meteor.Error('This group does not exist or action type you wanted to use was wrong');
			}
	},
});

