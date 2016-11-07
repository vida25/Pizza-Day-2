import { Router } from 'meteor/iron:router';
import '../../../ui/layouts/not_found/not_found.js';

	Router.route('not_found', {
		'path': '/not_found',
		'template': 'not_found',
	});
