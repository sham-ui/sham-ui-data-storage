/**
 * @url https://github.com/Octane/setImmediate
 * @type {Function}
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
 */
export default function debounceSubscribers( callbacks ) {
    ( window.setImmediate || setImmediatePolyfill )( () => {
        callbacks.forEach( cb => cb() );
        callbacks.clear();
    } );
}
