import { writable } from 'svelte/store';

import type { ChannelInterface, MediaType } from '$lib/Chs';
import type { OutgointMediaMessage } from '$lib';
import type { Socket } from 'socket.io-client';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

export let _channels = writable<ChannelInterface[]>([]);

export let _id = writable(0);

export let _connected_channel = writable('');

export let _state = writable('Home');

export let _socket = writable<Socket<DefaultEventsMap, DefaultEventsMap>>();

export let _msgs = writable<{ msg: OutgointMediaMessage; id: number; name: string }[]>([]);

export let _name = writable('');
