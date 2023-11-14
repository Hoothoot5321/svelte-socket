// place files you want to import through the `$lib` alias in this folder.

import type { Socket } from 'socket.io-client';
import { _channels, _connected_channel, _id, _msgs, _name } from '../store';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { MediaType } from './Chs';
import type { ChannelInterface } from './Chs';
import { Regexex } from './regexes';

export function startSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
	socket.on('connection', (msg) => {
		const parsed = JSON.parse(msg) as {
			channels: ChannelInterface[];
			id: number;
			name: string;
		};
		_channels.set(parsed.channels);
		_id.set(parsed.id);
		_name.set(parsed.name);
	});
	socket.on('update', (msg) => {
		const parsed = JSON.parse(msg) as { channels: ChannelInterface[] };
		_channels.set(parsed.channels);
	});
	socket.on('joinedChannel', (msg) => {
		_connected_channel.set(msg);
	});
	socket.on('channelMsg', (msg) => {
		let _msg = JSON.parse(msg) as { msg: string; id: number; name: string };
		let out = JSON.parse(_msg.msg) as OutgointMediaMessage;
		let damn = { msg: out, id: _msg.id, name: _msg.name };
		_msgs.update((l_msgs) => {
			l_msgs.push(damn);
			return l_msgs;
		});
	});
	socket.on('msgList', (msg) => {
		let _msg = JSON.parse(msg) as { msgs: { msg: string; id: number; name: string }[] };
		let out: { msg: OutgointMediaMessage; id: number; name: string }[] = [];
		for (let i = 0; i < _msg.msgs.length; i++) {
			let elem = _msg.msgs[i];
			let new_msg = JSON.parse(elem.msg) as OutgointMediaMessage;
			out.push({ msg: new_msg, id: elem.id, name: elem.name });
		}
		_msgs.set(out);
	});
}

export function connectToChanel(
	socket: Socket<DefaultEventsMap, DefaultEventsMap>,
	server_name: string,
	connected_channel: string
) {
	if (server_name === connected_channel) {
		socket.emit('discServer', server_name);
	} else {
		socket.emit('joinServer', server_name);
	}
}
export function createChannel(
	socket: Socket<DefaultEventsMap, DefaultEventsMap>,
	server_name: string
) {
	socket.emit('createServer', server_name);
}

export function sendMsg(
	socket: Socket<DefaultEventsMap, DefaultEventsMap>,
	msg: string,
	media_files: { type: MediaType; content: string }[]
) {
	let big_msg = { msg: msg, media_files: media_files };
	socket.emit('channelMsg', JSON.stringify(big_msg));
}
class MessageType {
	url: boolean;
	msg: string;

	constructor(url: boolean, msg: string) {
		this.url = url;
		this.msg = msg;
	}
}
export class MediaHolder {
	type: MediaType;
	content: string;

	constructor(type: MediaType, content: string) {
		this.type = type;
		this.content = content;
	}
}

export interface OutgointMediaMessage {
	msg: string;
	media_files: { type: MediaType; content: string }[];
}

function checkMPS(url: string) {
	let rege = new Regexex();
	return rege.testVideo(url) || rege.testAudio(url);
}
function checkYT(url: string) {
	return url.includes('https://www.youtube.com/');
}
function convertYt(url: string) {
	let replaced_url = url.replace('watch?v=', 'embed/');

	let index = replaced_url.search('&');

	if (!index) {
		return replaced_url;
	}

	replaced_url = replaced_url.substring(0, index);
	return replaced_url;
}
function checkURL(url: string) {
	return new Regexex().testImage(url);
}
export function detectUrl(text: string) {
	var urlRegex = /(https?:\/\/[^\s]+)/g;
	let matched_string = text.match(urlRegex);

	let start = 0;
	let msg_storage: MessageType[] = [];
	let multi_media: MediaHolder[] = [];
	if (!matched_string) {
		msg_storage.push(new MessageType(false, text));
		return { msgs: msg_storage, multi_median: multi_media };
	}
	for (let i = 0; i < matched_string.length; i++) {
		let index = text.indexOf(matched_string[i], start);
		let text1 = text.substring(start, index);

		let text2 = '';
		if (i == matched_string.length - 1) {
			text2 = text.substring(index + matched_string[i].length, text.length);
		}
		start = index + matched_string[i].length;

		msg_storage.push(new MessageType(false, text1));

		msg_storage.push(new MessageType(true, matched_string[i]));

		start = index + matched_string[i].length;

		msg_storage.push(new MessageType(false, text2));
		if (checkURL(matched_string[i])) {
			let new_media = new MediaHolder(MediaType.IMG, matched_string[i]);
			multi_media.push(new_media);
		}
		if (checkYT(matched_string[i])) {
			let converted = convertYt(matched_string[i]);

			multi_media.push(new MediaHolder(MediaType.YOUTUBE_VIDEO, converted));
		}
		if (checkMPS(matched_string[i])) {
			multi_media.push(new MediaHolder(MediaType.MP_LINK, matched_string[i]));
		}
	}
	return { msgs: msg_storage, multi_median: multi_media };
}
