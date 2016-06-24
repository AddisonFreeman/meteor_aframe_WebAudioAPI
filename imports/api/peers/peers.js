import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/factory';

/*
class PeersCollection extends Mongo.Collection {
	insert(peer, callback) {
		const ourPeer = peer;
		return super.insert(ourPeer, callback);
	}
	remove(selector, callback) {
		return super.remove(selector, callback);
	}
}
*/

export const Peers = new Mongo.Collection('Peers');

/*
Peers.schema = new SimpleSchema({
	peer: { type: Object },
// 	connection: { type: [Object] },	
});

Peers.attachSchema(Peers.schema);
*/


Peers.constructorParams = {
	key: 'igzv2i7egf340a4i',
	debug: 1,
	config: {'iceServers': [
		{ url: 'stun:stun.l.google.com:19302' },
		{ url: 'stun:stun1.l.google.com:19302' },
	]}
};

// Factory.define('peers', Peers, {});
/*

Peers.helpers({
	//what goes here?
});
*/