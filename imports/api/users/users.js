import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/factory';

export const Users = new Mongo.Collection('users');

Users.constructorParams = {
	key: 'hhmn0gl8g70newmi',
	debug: 1,
	config: {'iceServers': [
		{ url: 'stun:stun.l.google.com:19302' },
		{ url: 'stun:stun1.l.google.com:19302' },
	]}
};

/*

Users.helpers({
	//what goes here?
});
*/