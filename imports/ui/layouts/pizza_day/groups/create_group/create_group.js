		import { Meteor } from 'meteor/meteor';
		import { Template } from 'meteor/templating';
		import { ReactiveVar } from 'meteor/reactive-var';
		import './create_group.html';
		import { checkTheValue } from '../../../../components/regExp.js';

		Template.createGroups.onCreated(function onCreateGroupsCreated() {
			this.allow = new ReactiveVar(false);
			this.groupNoCreated = new ReactiveVar(true);
			this.default = new ReactiveVar(false);
		});

		Template.createGroups.helpers({
			success: function() {
				return Template.instance().allow.get();
			},
			groupNoCreated: function() {
				return Template.instance().groupNoCreated.get();
			},
			'default': function() {
				return Template.instance().default.get()
			}
		});

		Template.createGroups.events({
			'input #input_group_name': function(e) {
				let instance = Template.instance();
				let groupName = e.target.value;
				if (checkTheValue('groupName', groupName)) {
					if(!instance.default.get()) instance.default.set(true);

					Meteor.call('group_exist', Meteor.userId(), groupName, (err, rez) => {
						if(!rez)	instance.allow.set(true);
						else			instance.allow.set(false);
					});

				} else 	instance.allow.set(false);
			},
			'click #save_group': function(e) {
				let instance = Template.instance();
				let groupName = instance.$('#input_group_name').val();
					if (checkTheValue('groupName', groupName)) {
						Meteor.call('create_group', Meteor.userId(), groupName);
						instance.groupNoCreated.set(false);
					}
			}
		});

