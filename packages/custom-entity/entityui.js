import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import entityIcon from './theme/icons/entity.svg';

import CreateEntityCommand from './createentitycommand.js'

export default class EntityUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.commands.add( 'createEntity', new CreateEntityCommand( editor ) );
        const command = editor.commands.get( 'createEntity' );

        editor.ui.componentFactory.add( 'entity', locale => {

            const buttonView = new ButtonView( locale );

            buttonView.set( {
                label: t( 'Create entity' ),
                icon: entityIcon,
                tooltip: true,
                class: "createEntity"
            } );

            buttonView.on( 'execute', () => {
                editor.execute( 'createEntity' );
            } );

            buttonView.bind( 'isEnabled' ).to( command );

            return buttonView;
        } );
    }
}
