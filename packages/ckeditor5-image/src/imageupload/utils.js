/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageupload/utils
 */

/* global fetch, File */

import { global } from 'ckeditor5/src/utils';

/**
 * Creates a regular expression used to test for image files.
 *
 *		const imageType = createImageTypeRegExp( [ 'png', 'jpeg', 'svg+xml', 'vnd.microsoft.icon' ] );
 *
 *		console.log( 'is supported image', imageType.test( file.type ) );
 *
 * @param {Array.<String>} types
 * @returns {RegExp}
 */
export function createImageTypeRegExp( types ) {
	// Sanitize the MIME type name which may include: "+", "-" or ".".
	const regExpSafeNames = types.map( type => type.replace( '+', '\\+' ) );

	return new RegExp( `^image\\/(${ regExpSafeNames.join( '|' ) })$` );
}

/**
 * Creates a promise that fetches the image local source (Base64 or blob) and resolves with a `File` object.
 *
 * @param {module:engine/view/element~Element} image Image whose source to fetch.
 * @returns {Promise.<File>} A promise which resolves when an image source is fetched and converted to a `File` instance.
 * It resolves with a `File` object. If there were any errors during file processing, the promise will be rejected.
 */
export function fetchLocalImage( image ) {
	return new Promise( ( resolve, reject ) => {
		const imageSrc = image.getAttribute( 'src' );

		// Fetch works asynchronously and so does not block browser UI when processing data.
		fetch( imageSrc )
			.then( resource => resource.blob() )
			.then( blob => {
				const mimeType = getImageMimeType( blob, imageSrc );
				const ext = mimeType.replace( 'image/', '' );
				const filename = `image.${ ext }`;
				const file = new File( [ blob ], filename, { type: mimeType } );

				resolve( file );
			} )
			.catch( err => {
				// Fetch fails only, if it can't make a request due to a network failure or if anything prevented the request
				// from completing, i.e. the Content Security Policy rules. It is not possible to detect the exact cause of failure,
				// so we are just trying the fallback solution, if general TypeError is thrown.
				return err && err.name === 'TypeError' ?
					convertLocalImageOnCanvas( imageSrc ).then( resolve ).catch( reject ) :
					reject( err );
			} );
	} );
}

/**
 * Creates a promise that fetches the external image.
 *
 * @param {module:engine/view/element~Element} image Image whose source to fetch.
 * @returns {Promise.<File>} A promise which resolves when an image source is fetched and converted to a `File` instance.
 * It resolves with a `File` object. If there were any errors during file processing, the promise will be rejected.
 */
export function fetchExternalImage( image, $fetchURL ) {
	return new Promise( ( resolve, reject ) => {

		const imageSrc = image.getAttribute( 'src' );
		var fileName = imageSrc.split('/').pop().split('#')[0].split('?')[0];
		if (!fileName) fileName = 'image.jpg';

		const params = new URLSearchParams({
			src: imageSrc,
			name: fileName
		});

		fetch( $fetchURL + '?'+ params)
			.then( response => {
				var fn =  getFilenameFromContentDispositionHeader(response.headers.get('Content-Disposition'));
				if (fn) {
					fileName = fn;
				}
				console.log(fileName);
				return response.blob();
			})
			.then( blob => {
				console.log(fileName);
				const mimeType = getImageMimeType( blob, imageSrc );
				const file = new File( [ blob ], fileName, { type: mimeType } );
				resolve( file );
			} )
			.catch( err => {
				return err && err.name === 'TypeError' ?
					convertLocalImageOnCanvas( imageSrc ).then( resolve ).catch( reject ) :
					reject( err );
			} );
	} );
}

/**
 * Checks whether a given node is an image element with a local source (Base64 or blob).
 *
 * @param {module:image/imageutils~ImageUtils} imageUtils
 * @param {module:engine/view/node~Node} node The node to check.
 * @returns {Boolean}
 */
export function isLocalImage( imageUtils, node ) {
	if ( !imageUtils.isInlineImageView( node ) || !node.getAttribute( 'src' ) ) {
		return false;
	}

	return node.getAttribute( 'src' ).match( /^data:image\/\w+;base64,/g ) ||
		node.getAttribute( 'src' ).match( /^blob:/g );
}

/**
 * Checks whether a given node is an image element with a external source.
 *
 * @param {module:image/imageutils~ImageUtils} imageUtils
 * @param {module:engine/view/node~Node} node The node to check.
 * @returns {Boolean}
*/
export function isExternalImage( imageUtils, node ) {

	if ( !(imageUtils.isInlineImageView( node ) || imageUtils.isBlockImageView( node ) ) ) {
		return false;
	}

	var
		res = false,
		src = node.getAttribute( 'src' )
	;

	if ( src && !src.startsWith('/attachments') ) {
		res = true;
	}

	return res;
}


// Extracts an image type based on its blob representation or its source.
//
// @param {String} src Image `src` attribute value.
// @param {Blob} blob Image blob representation.
// @returns {String}
function getImageMimeType( blob, src ) {
	if ( blob.type ) {
		return blob.type;
	} else if ( src.match( /data:(image\/\w+);base64/ ) ) {
		return src.match( /data:(image\/\w+);base64/ )[ 1 ].toLowerCase();
	} else {
		// Fallback to 'jpeg' as common extension.
		return 'image/jpeg';
	}
}

// Creates a promise that converts the image local source (Base64 or blob) to a blob using canvas and resolves
// with a `File` object.
//
// @param {String} imageSrc Image `src` attribute value.
// @returns {Promise.<File>} A promise which resolves when an image source is converted to a `File` instance.
// It resolves with a `File` object. If there were any errors during file processing, the promise will be rejected.
function convertLocalImageOnCanvas( imageSrc ) {
	return getBlobFromCanvas( imageSrc ).then( blob => {
		const mimeType = getImageMimeType( blob, imageSrc );
		const ext = mimeType.replace( 'image/', '' );
		const filename = `image.${ ext }`;

		return new File( [ blob ], filename, { type: mimeType } );
	} );
}

// Creates a promise that resolves with a `Blob` object converted from the image source (Base64 or blob).
//
// @param {String} imageSrc Image `src` attribute value.
// @returns {Promise.<Blob>}
function getBlobFromCanvas( imageSrc ) {
	return new Promise( ( resolve, reject ) => {
		const image = global.document.createElement( 'img' );

		image.addEventListener( 'load', () => {
			const canvas = global.document.createElement( 'canvas' );

			canvas.width = image.width;
			canvas.height = image.height;

			const ctx = canvas.getContext( '2d' );

			ctx.drawImage( image, 0, 0 );

			canvas.toBlob( blob => blob ? resolve( blob ) : reject() );
		} );

		image.addEventListener( 'error', () => reject() );

		image.src = imageSrc;
	} );
}


/**
 * (c) 2017 Rob Wu <rob@robwu.nl> (https://robwu.nl)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';
/* exported getFilenameFromContentDispositionHeader */

/**
 * Extract file name from the Content-Disposition HTTP response header.
 *
 * @param {string} contentDisposition
 * @return {string} Filename, if found in the Content-Disposition header.
 */
function getFilenameFromContentDispositionHeader(contentDisposition) {
    // This parser is designed to be tolerant and accepting of headers that do
    // not comply with the standard, but accepted by Firefox.
    let needsEncodingFixup = true;

    // filename*=ext-value ("ext-value" from RFC 5987, referenced by RFC 6266).
    let tmp = toParamRegExp('filename\\*', 'i').exec(contentDisposition);
    if (tmp) {
        tmp = tmp[1];
        let filename = rfc2616unquote(tmp);
        filename = unescape(filename);
        filename = rfc5987decode(filename);
        filename = rfc2047decode(filename);
        return fixupEncoding(filename);
    }

    // Continuations (RFC 2231 section 3, referenced by RFC 5987 section 3.1).
    // filename*n*=part
    // filename*n=part
    tmp = rfc2231getparam(contentDisposition);
    if (tmp) {
        // RFC 2047, section 
        let filename = rfc2047decode(tmp);
        return fixupEncoding(filename);
    }

    // filename=value (RFC 5987, section 4.1).
    tmp = toParamRegExp('filename', 'i').exec(contentDisposition);
    if (tmp) {
        tmp = tmp[1];
        let filename = rfc2616unquote(tmp);
        filename = rfc2047decode(filename);
        return fixupEncoding(filename);
    }
    return '';

    function toParamRegExp(attributePattern, flags) {
        return new RegExp(
            '(?:^|;)\\s*' + attributePattern + '\\s*=\\s*' +
            // Captures: value = token | quoted-string
            // (RFC 2616, section 3.6 and referenced by RFC 6266 4.1)
            '(' +
                '(?!")[^;]+' +
            '|' +
                '"(?:[^"\\\\]|\\\\"?)+"?' +
            ')', flags);
    }
    function textdecode(encoding, value) {
        if (encoding) {
            try {
                let decoder = new TextDecoder(encoding, {fatal: true});
                let bytes = Array.from(value, c => c.charCodeAt(0));
                if (bytes.every(code => code <= 0xFF)) {
                    value = decoder.decode(new Uint8Array(bytes));
                    needsEncodingFixup = false;
                }
            } catch (e) {
                // TextDecoder constructor threw - unrecognized encoding.
            }
        }
        return value;
    }
    function fixupEncoding(value) {
        if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
            // Maybe multi-byte UTF-8.
            value = textdecode('utf-8', value);
            if (needsEncodingFixup) {
                // Try iso-8859-1 encoding.
                value = textdecode('iso-8859-1', value);
            }
        }
        return value;
    }
    function rfc2231getparam(contentDisposition) {
        let matches = [], match;
        // Iterate over all filename*n= and filename*n*= with n being an integer
        // of at least zero. Any non-zero number must not start with '0'.
        let iter = toParamRegExp('filename\\*((?!0\\d)\\d+)(\\*?)', 'ig');
        while ((match = iter.exec(contentDisposition)) !== null) {
            let [, n, quot, part] = match;
            n = parseInt(n, 10);
            if (n in matches) {
                // Ignore anything after the invalid second filename*0.
                if (n === 0) break;
                continue;
            }
            matches[n] = [quot, part];
        }
        let parts = [];
        for (let n = 0; n < matches.length; ++n) {
            if (!(n in matches)) {
                // Numbers must be consecutive. Truncate when there is a hole.
                break;
            }
            let [quot, part] = matches[n];
            part = rfc2616unquote(part);
            if (quot) {
                part = unescape(part);
                if (n === 0) {
                    part = rfc5987decode(part);
                }
            }
            parts.push(part);
        }
        return parts.join('');
    }
    function rfc2616unquote(value) {
        if (value.startsWith('"')) {
            let parts = value.slice(1).split('\\"');
            // Find the first unescaped " and terminate there.
            for (let i = 0; i < parts.length; ++i) {
                let quotindex = parts[i].indexOf('"');
                if (quotindex !== -1) {
                    parts[i] = parts[i].slice(0, quotindex);
                    parts.length = i + 1; // Truncates and stop the iteration.
                }
                parts[i] = parts[i].replace(/\\(.)/g, '$1');
            }
            value = parts.join('"');
        } else {
            value = value.replace(/[\r\n]/g, '');
            // Exclude trailing whitespace that's matched by toParamRegExp.
            value = value.replace(/\s+$/, '');
        }
        return value;
    }
    function rfc5987decode(extvalue) {
        // Decodes "ext-value" from RFC 5987.
        let encodingend = extvalue.indexOf('\'');
        if (encodingend === -1) {
            // Some servers send "filename*=" without encoding'language' prefix,
            // e.g. in https://github.com/Rob--W/open-in-browser/issues/26
            // Let's accept the value like Firefox (57) (Chrome 62 rejects it).
            return extvalue;
        }
        let encoding = extvalue.slice(0, encodingend);
        let langvalue = extvalue.slice(encodingend + 1);
        // Ignore language (RFC 5987 section 3.2.1, and RFC 6266 section 4.1 ).
        let value = langvalue.replace(/^[^']*'/, '');
        return textdecode(encoding, value);
    }
    function rfc2047decode(value) {
        // RFC 2047-decode the result. Firefox tried to drop support for it, but
        // backed out because some servers use it - https://bugzil.la/875615
        // Firefox's condition for decoding is here: https://searchfox.org/mozilla-central/rev/4a590a5a15e35d88a3b23dd6ac3c471cf85b04a8/netwerk/mime/nsMIMEHeaderParamImpl.cpp#742-748

        // We are more strict and only recognize RFC 2047-encoding if the value
        // starts with "=?", since then it is likely that the full value is
        // RFC 2047-encoded.

        // Firefox also decodes words even where RFC 2047 section 5 states:
        // "An 'encoded-word' MUST NOT appear within a 'quoted-string'."

        // eslint-disable-next-line no-control-regex
        if (!value.startsWith('=?') || /[\x00-\x19\x80-\xff]/.test(value)) {
            return value;
        }
        // RFC 2047, section 2.4
        // encoded-word = "=?" charset "?" encoding "?" encoded-text "?="
        // charset = token (but let's restrict to characters that denote a
        //           possibly valid encoding).
        // encoding = q or b
        // encoded-text = any printable ASCII character other than ? or space.
        //                ... but Firefox permits ? and space.
        return value.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g,
            function(_, charset, encoding, text) {
                if (encoding === 'q' || encoding === 'Q') {
                    // RFC 2047 section 4.2.
                    text = text.replace(/_/g, ' ');
                    text = text.replace(/=([0-9a-fA-F]{2})/g,
                        (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                    return textdecode(charset, text);
                } // else encoding is b or B - base64 (RFC 2047 section 4.1)
                try {
                    text = atob(text);
                } catch (e) {
                }
                return textdecode(charset, text);
            });
    }
}
