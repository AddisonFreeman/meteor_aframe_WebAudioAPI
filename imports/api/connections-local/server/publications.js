import { Meteor } from 'meteor/meteor';
import { Commections } from"../peers.js";

Meteor.publish('connections', () => {
	return Connections.find();
})