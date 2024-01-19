/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { CKFinderUploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
// import { CKBox } from '@ckeditor/ckeditor5-ckbox';
// import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
// import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Image, ImageBlock, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, PictureEditing, ImageResize } from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
// import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar, TableCaption, TableColumnResize } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
// import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';

import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';
import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';
import { Strikethrough, Code, Subscript, Superscript, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';

import EmbedWidget from '../../custom-embedWidget/embedwidget';
import ImagePanel from '../../custom-imagePanel/imagepanel';
import Fullscreen from '../../custom-fullscreen/fullscreen';
import Entity from '../../custom-entity/entity';

export default class ClassicEditor extends ClassicEditorBase {
	public static override builtinPlugins = [
		Essentials,
		CKFinderUploadAdapter,
		Autoformat,
		Bold,
		Italic,
		BlockQuote,

		// CKBox,
		// CKFinder,
		// CloudServices,
		// EasyImage,

		Heading,
		ImageBlock,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		ImageResize,
		Indent,
		Link,
		List,
		// MediaEmbed,
		Paragraph,
		PasteFromOffice,
		PictureEditing,
		Table,
		TableToolbar,
		TableCaption,
		TableColumnResize,
		TextTransformation,

		Autosave,
		HeadingButtonsUI,
		Strikethrough,
		Code,
		CodeBlock,
		Subscript,
		Superscript,
		Underline,

		EmbedWidget,
		ImagePanel,
		Fullscreen,
		Entity
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'link',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				'uploadImage',
				'blockQuote',
				'insertTable',
				'mediaEmbed',
				'undo',
				'redo',
				'|',
				'entity'
			]
		},
		image: {
			toolbar: [
				'imageStyle:alignRight',
				'imageStyle:block',
				'imageStyle:alignLeft',
				'|',
				'toggleImageCaption'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells',
				'|',
				'toggleTableCaption'
			]
		},
		// This value must be kept in sync with the language defined in webpack.config.js.
		language: 'en'
	};
}
