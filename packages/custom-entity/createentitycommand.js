import Command from '@ckeditor/ckeditor5-core/src/command';

export default class CreateEntityCommand extends Command {

    execute(data) {
        // const editor = this.editor;
        // const model = editor.model;
        // const selection = model.document.selection;

        var text = getSelectedText(this.editor);
        if (text != '') {
            z.dispatch( { e: "createEntity", f: this.editor.sourceElement.closest(".editorBlock"), p: "parent", data: { text: text } } );
        }
    }

    refresh() {
        var text = getSelectedText(this.editor);
        this.isEnabled = (text != '');
    }
}

function getSelectedText(editor)
{
    const model = editor.model;
    const selection = model.document.selection;

    var
        text = '',
        range = selection.getFirstRange()
    ;

    for ( const item of range.getItems() ) {
        if (item.is( 'textProxy' )) text += item.data;
    }

   return text;
}
