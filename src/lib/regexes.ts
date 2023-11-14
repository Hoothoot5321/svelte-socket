export class Regexex {
	constructor() {}
	testImage(test: string) {
		let rege = /\.(jpeg|jpg|png|webp|gif)/g;
		return test.match(rege) != null;
	}

	testVideo(test: string) {
		let rege = /\.(mp4)/g;
		return test.match(rege) != null;
	}

	testAudio(test: string) {
		let rege = /\.(mp3)/g;
		return test.match(rege) != null;
	}
}
