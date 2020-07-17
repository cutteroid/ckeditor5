import Command from '@ckeditor/ckeditor5-core/src/command';
import Template from '@ckeditor/ckeditor5-ui/src/template';

import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';
import { insertEmbedWidget } from './utils';

export default class InsertEmbedWidgetCommand extends Command {

    execute(data) {
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;
        var insertPosition = findOptimalInsertionPosition( selection, model );

        if (data.prepend_content) {
            const viewFragment = editor.data.processor.toView( data.prepend_content );
            const modelFragment = editor.data.toModel( viewFragment );
            const range = model.insertContent( modelFragment, insertPosition, null, 'end' );

            insertPosition = model.createSelection( range.end, 'after' );
        }

        insertEmbedWidget( model, data, insertPosition );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'embedWidget' );

        this.isEnabled = allowedIn !== null;
    }
}
