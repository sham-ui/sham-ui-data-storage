import { DI } from 'sham-ui';
import useStorageInComponent from './component-wrapper';
import storageFactory from './factory';

/**
 * @param {Object} fieldsWithDefault
 * @param {Object} [options]
 * @return {{storage: {}, useStorage: (function())}}
 */
export default function createStorage( fieldsWithDefault, options = {} ) {

    // By default LIFO disabled
    const { LIFO = false } = options;

    const fields = Object.keys( fieldsWithDefault );
    const storage = storageFactory( fields, fieldsWithDefault, LIFO );

    // Registry in DI
    if ( undefined !== options.DI ) {
        DI.bind( options.DI, storage );
    }

    return {
        storage,

        /**
         * Decorator for component
         * @param {String} storageAlias
         * @return {Function}
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
