export function indexOfItem( Items, Item ) {
	let i = Items.length;
	for(;i--;) if(Items[i].itemName === Item.itemName) 	return i;
	return -1;
}

export function buttonStyle(b,o) {
	if(b.text() === '+') {
		o.prop('disabled',true);
		b.text('-');
	}	else {
		b.text('+');
		o.prop('disabled',false);
	}
}

export function pushPullOrder(orders_push_pull, groupName, action) {
		let orders = orders_push_pull.map(( order )=>{
			return {itemName: order.itemName,	count: order.count}
		});
		Meteor.call('update_event_order', Meteor.userId(), groupName, orders, action);
}

export 	function isOwner(Groups, groupName, userId) {
	let group = Groups.findOne({groupName});
	if(group)	return userId === group.owner._id;
	return false;
}

export 	function eventExist(Groups, groupName) {
	let group = Groups.findOne({groupName});
	if(group) return group.eventExist;
	return false;
}
