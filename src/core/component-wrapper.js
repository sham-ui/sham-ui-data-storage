import { options } from 'sham-ui';
import createProxy from './proxy';

/**
 * @param {Function} componentClass
 * @param {string} storageName
 * @param {Storage} storage
 * @param {string[]} fields
 * @return {ComponentWithStorage}
 * @private
 */
export default function useStorageInComponent( componentClass, storageName, storage, fields ) {
    const proxyByInstance = new WeakMap();

    return class ComponentWithStorage extends componentClass {
        constructor() {
            super( ...arguments );
            proxyByInstance.set( this, createProxy( this, storage, fields ) );
        }
        remove() {
            super.remove( ...arguments );
            proxyByInstance.get( this ).destroy();
            proxyByInstance.delete( this );
        }

        configureOptions() {

            // Manual add decorator
            options( this, storageName, {
                get: function() {
                    return proxyByInstance.get( this ).proxy;
                }
            } );
            super.configureOptions( ...arguments );
        }
    };
}
