export function modelToViewUrlAttributeConverter( registry, data ) {

	return dispatcher => {
		dispatcher.on( 'attribute:data:embedWidget', converter );
	};

	function converter( evt, data, conversionApi ) {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const url = data.attributeNewValue;
		const viewWriter = conversionApi.writer;
		const figure = conversionApi.mapper.toViewElement( data.item );
		// const mediaContentElement = [ ...figure.getChildren() ]
		// 	.find( child => child.getCustomProperty( 'embed-widget' ) );

		// viewWriter.remove( mediaContentElement );

		// const mediaViewElement = registry.getMediaViewElement( viewWriter, url );

		viewWriter.insert( viewWriter.createPositionAt( figure, 0 ) );
	}
}
