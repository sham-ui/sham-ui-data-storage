import { debounceSubscribers, runSubscribers } from './subscribers';

/**
 * @class {Object} Storage
 */

/**
 * @param {string[]} fields
 * @param {Object} defaultValues
 * @param {boolean} LIFO
 * @return Storage
 * @private
 */
export default function storageFactory( fields, defaultValues, LIFO ) {
    const subscribersByField = new Map();
    const internalStorage = new Map();
    const deferredSubscribers = new Set();

    /**
     * @type {Storage}
     * @inner
     */
    const storage = Object.defineProperties( {}, {

        /**
         * Add watcher for field
         * @memberof Storage
         * @function
         * @param {string} field Name of field
         * @param {Function} cb Callback
         */
        addWatcher: {
            enumerable: false,
            value: function( field, cb ) {
                subscribersByField.get( field ).add( cb );
            }
        },

        /**
         * Remove watcher for field
         * @memberof Storage
         * @function
         * @param {string} field Name of field
         * @param {Function} cb Callback
         */
        removeWatcher: {
            enumerable: false,
            value: function( field, cb ) {
                deferredSubscribers.delete( cb );
                subscribersByField.get( field ).delete( cb );
            }
        },

        /**
         * Remove all watchers & reset storage field to default values
         * @memberof Storage
         * @function
         */
        reset: {
            enumerable: false,
            value: function() {
                deferredSubscribers.clear();
                fields.forEach( field => {
                    subscribersByField.get( field ).clear();
                    internalStorage.set( field, defaultValues[ field ] );
                } );
            }
        },

        /**
         * Run all deferred subscribers immediate
         * @memberof Storage
         * @function
         */
        sync: {
            enumerable: false,
            value: function() {
                runSubscribers( deferredSubscribers, LIFO );
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
                    debounceSubscribers( deferredSubscribers, LIFO );
                }
            }
        } );
    } );

    return storage;
}
