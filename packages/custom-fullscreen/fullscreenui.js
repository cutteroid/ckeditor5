import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import fullscreenIcon from './theme/icons/fullscreen.svg';

export default class FullscreenUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;

        editor.ui.componentFactory.add( 'fullscreen', locale => {

            const buttonView = new ButtonView( locale );

            buttonView.set( {
                label: t( 'Fullscreen' ),
                icon: fullscreenIcon,
                tooltip: true,
                class: "toggleFullscreen"
            } );

            this.listenTo( buttonView, 'execute', function(){
                z.dispatch( { e: "toggleFullscreen", f: buttonView.element.closest(".editorBlock"), p: "parent" } );
            });

            return buttonView;
        } );
    }
}
