import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FullscreenUI from './fullscreenui';

export default class Fullscreen extends Plugin {
	/**
	 * @inherptDocui
	 */
	static get requires() {
		return [ FullscreenUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Fullscreen';
	}
}
