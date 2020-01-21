import { DI } from 'sham-ui';
import useStorageInComponent from './component-wrapper';
import storageFactory from './factory';

/**
 * Options for `createStorage`
 * @typedef {Object} CreateStorageOptions
 * @property {string} DI Registry storage in DI with this key. By default not specified.
 * @property {boolean} LIFO Use LIFO (last input first output) for storage subscribers. By default false
 * @property {boolean} sync Disable async run watchers callback. Callbacks will run only after call `sync` storage method. By default false
 */

/**
 * Create a new storage object.
 * @param {Object} fieldsWithDefault Fields of storage
 * @param {CreateStorageOptions} [options] Extra options for storage
 * @return {{storage: Storage, useStorage: (function())}}
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

    const {
        LIFO = false, // By default LIFO disabled
        sync = false  // By default sync disabled
    } = options;

    const fields = Object.keys( fieldsWithDefault );
    const storage = storageFactory( fields, fieldsWithDefault, { LIFO, sync } );

    // Registry in DI
    if ( undefined !== options.DI ) {
        DI.bind( options.DI, storage );
    }

    return {
        storage,

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
         *   class Profile extends Template {
         *
         *   }
         *
         *   export default useStorage( 'sessionData' )( Profile );
         * </script>
         */
        useStorage( storageAlias ) {
            return function( componentClass ) {
                return useStorageInComponent(
                    componentClass,
                    storageAlias,
                    storage,
                    fields
                );
            };
        }
    };
}
