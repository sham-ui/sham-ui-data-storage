import nanoid from 'nanoid';
import useStorageInComponent from './component-adapter';
import storageFactory from './factory';

/**
 * Getter for storage
 * @typedef {Function} StorageGetter
 * @param {Object} DI
 * @return {Storage}
 */

/**
 * Options for `createStorage`
 * @typedef {Object} CreateStorageOptions
 * @property {string} DI Registry storage in DI with this key. By default use `storage:<random key>` as key.
 * @property {boolean} LIFO Use LIFO (last input first output) for storage subscribers. By default false
 * @property {boolean} sync Disable async run watchers callback. Callbacks will run only after call `sync` storage method. By default false
 */

/**
 * Create a new unique storage object for current DI.
 * @param {Object} fieldsWithDefault Fields of storage
 * @param {CreateStorageOptions} [options] Extra options for storage
 * @return {{storage: StorageGetter, useStorage: (function())}}
 * @example
 * import createStorage from 'sham-ui-data-storage';
 * export const { storage, useStorage } = createStorage( {
 *    name: '',
 *    email: '',
 *    sessionValidated: false,
 *    isAuthenticated: false
 * }, { DI: 'session:storage' } );
 */
export default function createStorage( fieldsWithDefault, options = {} ) {
    const fields = Object.keys( fieldsWithDefault );

    const id = undefined === options.DI ?
        `storage:${nanoid()}` :
        options.DI
    ;

    // Closure for lazy creating storage after DI will ready
    function getOrCreate( DI ) {
        let storage = DI.resolve( id );
        if ( storage === undefined ) {
            const {
                LIFO = false, // By default LIFO disabled
                sync = false  // By default sync disabled
            } = options;
            storage = storageFactory( fields, fieldsWithDefault, { LIFO, sync } );
            DI.bind( id, storage );
        }
        return storage;
    }

    return {

        /**
         * Return storage for DI container
         * @param {Object} DI App DI container
         * @return {Storage}
         */
        storage( DI ) {
            return getOrCreate( DI );
        },

        /**
         * Decorator for component
         * @param {string} storageAlias Name of classProperty for access to storage fields
         * @return {Function}
         * @example
         * <template>
         *   <span class="logged-name">
         *     {{sessionData.name}}
         *   </span>
         * </template>
         *
         * <script>
         *   import { useStorage } from '../../../storages/session';
         *
         *   function Profile {
         *
         *   }
         *
         *   export default Component( Template, useStorage( ref( 'sessionData' ) ), Profile );
         * </script>
         */
        useStorage( storageAlias ) {
            return useStorageInComponent( storageAlias, getOrCreate, fields );
        }
    };
}
