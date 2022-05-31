import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import EntityUI from './entityui';

export default class Entity extends Plugin {
	/**
	 * @inherptDocui
	 */
	static get requires() {
		return [ EntityUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Entity';
	}
}
