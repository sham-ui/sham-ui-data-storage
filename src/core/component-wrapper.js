import { options } from 'sham-ui';
import createProxy from './proxy';

/**
 * @param {Function} componentClass
 * @param {String} storageName
 * @param {Storage} storage
 * @param {String[]} fields
 * @return {ComponentWithStorage}
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
