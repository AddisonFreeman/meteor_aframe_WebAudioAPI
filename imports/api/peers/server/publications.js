import { Meteor } from 'meteor/meteor';
import { Peers } from"../peers.js";
console.log('loaded');
Meteor.publish('peers', () => {
	return Peers.find();
})