import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import '../../../ui/layouts/master_layout/master_layout.js';
import '../../../ui/layouts/footer_header/footer/footer.js';
import '../../../ui/layouts/footer_header/header/header.js';
import '../../../ui/layouts/not_found/not_found.js';
import '../../../ui/layouts/home/home.js';
import 'meteor/sacha:spin';


Router.configure({
	layoutTemplate: 'masterLayout',
	yieldTemplates: {
		'Header': {'to': 'header'},
		'Footer': {'to': 'footer'}
	},
	notFoundTemplate: 'notFound',
	loadingTemplate: 'spinner'
});


Router.onBeforeAction(function() {
	if(Meteor.userId() === null)
		this.redirect('home');
	this.next();
},{except: ['home']});
