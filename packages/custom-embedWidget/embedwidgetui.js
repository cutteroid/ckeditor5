import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imagePanelIcon from './theme/icons/icon.svg';

export default class EmbedWidgetUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add( 'embedPanel', locale => {

            const buttonView = new ButtonView( locale );

            buttonView.set( {
                label: t( 'Embed panel' ),
                icon: imagePanelIcon,
                tooltip: true,
                class: "embedPanelButton"
            } );

            this.listenTo( buttonView, 'execute', function(){
                z.dispatch( { e: "openEmbedPanel", f: buttonView.element.closest(".editorBlock"), p: "parent" } );
            });

            return buttonView;
        } );
    }
}
