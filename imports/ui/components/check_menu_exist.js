import { checkTheValue } from './regExp.js';
import { Groups } from '../../api/groups_collection.js';

export function allow_update_menu(ownerId, groupName, menuId, itemName, price, descript) {
		check(ownerId, Meteor.userId());
		check(menuId, String);
		check(descript, String);
		check(groupName, String);
		if(!checkTheValue('menuItem', itemName) || !checkTheValue('price', price) ||	descript.length > 50 || descript.length < 11 )
			throw new Meteor.Error('Some thing went wrong');
		let group = Groups.findOne({groupName});
		if(group !== undefined)
			return (group.owner._id === ownerId) ||
							group.users.some((user)=>{return user === ownerId});
		return false;
}