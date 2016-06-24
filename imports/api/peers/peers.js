import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/factory';

class PeersCollection extends Mongo.Collection {
	insert(peer, callback) {
		const ourPeer = peer;
		return super.insert(ourPeer, callback);
	}
	remove(selector, callback) {
		return super.remove(selector, callback);
	}
}

export const Peers = new PeersCollection('Peers');

Peers.deny({
// 	insert() { return true; },
// 	update() { return true; },
// 	remove() { return true; },
});

Peers.schema = new SimpleSchema({
	pid: { type: String },	
});

Peers.attachSchema(Peers.schema);


Peers.constructorParams = {
	key: 'npgldigfyu3gcik9',
	debug: 3,
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