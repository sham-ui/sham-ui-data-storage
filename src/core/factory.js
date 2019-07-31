import debounceSubscribers from './subscribers';

/**
 * @param {String[]} fields
 * @param {Object} defaultValues
 * @return Storage
 */
export default function storageFactory( fields, defaultValues ) {
    const subscribersByField = new Map();
    const internalStorage = new Map();
    const deferredSubscribers = new Set();

    /**
     * @type {Storage}
     */
    const storage = Object.defineProperties( {}, {
        addWatcher: {
            enumerable: false,
            value: function( field, cb ) {
                subscribersByField.get( field ).add( cb );
            }
        },
        removeWatcher: {
            enumerable: false,
            value: function( field, cb ) {
                deferredSubscribers.delete( cb );
                subscribersByField.get( field ).delete( cb );
            }
        },
        reset: {
            enumerable: false,
            value: function() {
                deferredSubscribers.clear();
                fields.forEach( field => {
                    subscribersByField.get( field ).clear();
                    internalStorage.set( field, defaultValues[ field ] );
                } );
            }
        }
    } );

    fields.forEach( field => {

        // Set default value
        internalStorage.set( field, defaultValues[ field ] );

        // Init subscribers for field
        subscribersByField.set( field, new Set() );

        // Create getter/setter
        Object.defineProperty( storage, field, {
            enumerable: true,
            get: function() {
                return internalStorage.get( field );
            },
            set: function( value ) {
                const oldValue = internalStorage.get( field );
                internalStorage.set( field, value );

                if ( oldValue !== value ) { // Call subscribers for only changed fields

                    // Copy callback to deferredSubscribers
                    subscribersByField.get( field ).forEach(
                        cb => deferredSubscribers.add( cb )
                    );

                    // Async execute deferredSubscribers
                    debounceSubscribers( deferredSubscribers );
                }
            }
        } );
    } );

    return storage;
}
