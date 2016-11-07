import { Meteor } from 'meteor/meteor';
import { Events } from './events/events_collection.js';
import { Groups } from './groups_collection.js';
import { isOwner } from '../ui/components/components.js';

Meteor.methods({
	'sendEmail': function (ownerId, email, password, groupName) {
		check(groupName, String);
		check(isOwner(Groups, groupName, ownerId), true);
		check(email, String);
		check(password, String);
		let _this = this;
		let hostEmail = email.replace('@', '%40');
		// smtp://USERNAME:PASSWORD@HOST:PORT/
		process.env.MAIL_URL = `smtp://${hostEmail}:${password}@smtp.gmail.com:465/`;

		let event = Events.findOne({'groupName': groupName});
		let total_to_pay = {};
		let total_discount = {};
		let all_items_to_order = [];
		let all_money_to_pay = 0;
		let massages = {};

		event.orders.forEach(( menuItem ) => {
					let price = menuItem.itemPrice;
					let total_count = menuItem.customers.reduce((a,b)=>{return a + b.count},0);
					if(total_count !== 0) {
						all_items_to_order.push({itemName: menuItem.itemName,
																			itemPrice: price,
																			count: total_count,
																			discount: menuItem.discount});
						menuItem.customers.forEach(( customer ) => {
							let discount = 0;
							if(!total_to_pay[customer._id])	total_to_pay[customer._id] = 0;
								total_to_pay[customer._id] += price * customer.count;
								all_money_to_pay += price * customer.count;
							if(menuItem.discount !== 0) {
								if(!total_discount[customer._id])	total_discount[customer._id] = 0;
									discount =  price * customer.count * menuItem.discount / total_count;
									total_discount[customer._id] += discount;
							}
							if(!massages[customer._id]) massages[customer._id] = 'Your order is:\n';
								massages[customer._id] += concatStr(menuItem.itemName, customer.count, price, discount);
						});
					}
		});

		let users = Meteor.users.find({'$or': event.subscribers.filter(( sub ) => {return sub.subscribed === true})
																														.map((sub) => {return sub.userId})
																	}).fetch();

		let all_order = 'All items you need to order in restaurant:\n';
		all_items_to_order.forEach(( item ) => {
			all_order += concatStr(item.itemName, item.count, item.itemPrice, (item.discount*item.itemPrice));
		});

		users.forEach(( user ) => {
			sendEmailto(user.services.google.email, hostEmail, massages[user._id],
									total_to_pay[user._id], total_discount[user._id], _this);
		});

		sendEmailto(email, hostEmail, all_order,
									sumOf(total_to_pay), sumOf(total_discount), _this);

	},
});

		function concatStr(item1, item2, item3, item4) {
			return `${item1}: Count = ${item2} Price = ${item3.toFixed(2)}; Discount = ${(item4).toFixed(2)}\n`;
		}
		function sumOf( obj ) {
			let sum = 0;
			for(p in obj) sum += obj[p];
			return sum;
		}
		function sendEmailto( to, from, textAllOrder , totalToPay, totalDiscount , self) {
			let text = `${textAllOrder}
			Total discount = ${totalDiscount.toFixed(2)};
			Total to pay = ${(totalToPay - totalDiscount).toFixed(2)};`;
			console.log(text);
			self.unblock();
			Email.send({
				to: to,
				from: from.replace('%40','@'),
				subject: 'Your pizza order',
				text: text
			});
		}