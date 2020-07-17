import { isWidget, toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

export function insertEmbedWidget( model, data, insertPosition ) {
	model.change( writer => {
		const mediaElement = writer.createElement( 'embedWidget', data );

		model.insertContent( mediaElement, insertPosition );
		writer.setSelection( null );
	} );
}

export function createMediaFigureElement( writer, registry, data ) {

	const figure = writer.createContainerElement( 'figure', { class: 'embedWidget', type: data.type, uid: data.uid, translated: data.translated } );

	figure.getFillerOffset = null;

	writer.insert( writer.createPositionAt( figure, 0 ), registry.getMediaViewElement( writer, data ) );

	return figure;
}

export function toEmbedWidget( viewElement, writer ) {
	writer.setCustomProperty( 'embed-widget', true, viewElement );

	return toWidget( viewElement, writer );
}
