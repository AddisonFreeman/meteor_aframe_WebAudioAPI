import { Meteor } from 'meteor/meteor';
import { Peers } from"../peers.js";

Meteor.publish('peers', () => {
	return Peers.find();
})