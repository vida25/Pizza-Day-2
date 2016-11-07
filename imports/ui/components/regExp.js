
export function checkTheValue(type, value) {
	switch (type) {
		case 'email':
			return /^([a-z])([a-z0-9_]){2,40}\@([a-z0-9]){2,10}(\.([a-z]){2,10}){1,3}$/i.test(value);
		break;
		case 'groupName':
		case 'menuItem':
		case 'menuCategory':
			return /^(((([a-zа-яієї][a-zа-я0-9іьєї\']{0,10}\s?){1,1}[a-zа-я0-9іьєї\']{1,10}))[a-zа-яієї])$/i.test(value);
		break;
		case 'password':
			return /^([a-z])([a-z0-9_]){4,}$/i.test(value);
		break;
		case 'price':
			return /^[0-9][0-9]{0,4}([\.][0-9])?[0-9]{0,1}$/i.test(value);
		break;
		case 'count':
			return /^[1-9][0-9]?$/i.test(value);
		break;
		default:
			throw new Meteor.Error('Wrong type value');
		break;
	}
}
