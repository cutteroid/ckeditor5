import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImagePanelUI from './imagepanelui';

export default class ImagePanel extends Plugin {
	/**
	 * @inherptDocui
	 */
	static get requires() {
		return [ ImagePanelUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePanel';
	}
}
