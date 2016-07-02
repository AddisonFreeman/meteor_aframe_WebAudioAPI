import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/factory';

export const Connections = new Mongo.Collection('connections');

Connections.constructorParams = {
	key: 'igzv2i7egf340a4i',
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