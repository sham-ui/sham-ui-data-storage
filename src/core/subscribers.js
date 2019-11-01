/**
 * @see https://github.com/Octane/setImmediate
 * @type {Function}
 * @private
 */
let uid = 0;
const storage = {};
let firstCall = true;
const message = 'setImmediatePolyfillMessage';

function callback( event ) {
    const key = event.data;
    if ( typeof key === 'string' && key.indexOf( message ) === 0 ) {
        const func = storage[ key ];
        if ( func ) {
            delete storage[ key ];
            func();
        }
    }
}

function setImmediatePolyfill( cb ) {
    const id = uid++;
    const key = message + id;
    storage[ key ] = cb;
    if ( firstCall ) {
        firstCall = false;
        window.addEventListener( 'message', callback );
    }
    window.postMessage( key, '*' );
    return id;
}

/**
 * @param {Set<Function>} callbacks
 * @param {boolean} LIFO
 * @private
 */
export function runSubscribers( callbacks, LIFO ) {
    (
        LIFO ?
            [ ...callbacks ].reverse() :
            callbacks
    ).forEach(
        cb => cb()
    );
    callbacks.clear();
}

/**
 * @param {Set<Function>} callbacks
 * @param {boolean} LIFO
 * @private
 */
export function debounceSubscribers( callbacks, LIFO ) {
    ( window.setImmediate || setImmediatePolyfill )(
        () => runSubscribers( callbacks, LIFO )
    );
}
