import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imagePanelIcon from './theme/icons/imagePanel.svg';

export default class ImagePanelUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add( 'imagePanel', locale => {

            const buttonView = new ButtonView( locale );

            buttonView.set( {
                label: t( 'Image panel' ),
                icon: imagePanelIcon,
                tooltip: true,
                class: "imagePanelButton"
            } );

            this.listenTo( buttonView, 'execute', function(){
                z.dispatch( { e: "openImagePanel", f: buttonView.element.closest(".editorBlock"), p: "parent" } );
            });

            return buttonView;
        } );
    }
}
