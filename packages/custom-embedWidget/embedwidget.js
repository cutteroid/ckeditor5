import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget'

import EmbedWidgetEditing from './embedwidgetediting';
import EmbedWidgetUI from './embedwidgetui';

export default class EmbedWidget extends Plugin {
	/**
	 * @inherptDocui
	 */
	static get requires() {
		return [ Widget, EmbedWidgetEditing, EmbedWidgetUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'EmbedWidget';
	}
}
