import { options } from 'sham-ui';
import createProxy from './proxy';

/**
 * @param {Function} componentClass
 * @param {string} storageName
 * @param {StorageGetter} storageGetter
 * @param {string[]} fields
 * @return {ComponentWithStorage}
 * @private
 */
// eslint-disable-next-line max-len
export default function useStorageInComponent( componentClass, storageName, storageGetter, fields ) {
    const proxyByInstance = new WeakMap();

    return class ComponentWithStorage extends componentClass {
        constructor() {
            super( ...arguments );
            proxyByInstance.set(
                this,
                createProxy( this, storageGetter( this.DI ), fields )
            );
        }
        remove() {
            super.remove( ...arguments );
            proxyByInstance.get( this ).destroy();
            proxyByInstance.delete( this );
        }

        configureOptions() {

            // Manual add decorator
            options( this, storageName, {
                get: () => {
                    return proxyByInstance.get( this ).proxy;
                }
            } );
            super.configureOptions( ...arguments );
        }
    };
}
