import { MediaType } from './Chs';
import { Regexex } from './regexes';

export function testFile(file: File) {
	let file_name = file.name;
	let rege = new Regexex();
	if (rege.testImage(file_name)) {
		return MediaType.IMG_FILE;
	}
	if (rege.testVideo(file_name)) {
		return MediaType.VIDEO_FILE;
	}
	if (rege.testAudio(file_name)) {
		return MediaType.AUDIO_FILE;
	}
	return MediaType.TEXT_FILE;
}
