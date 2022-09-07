
/**
 * @param {string} storageName
 * @param {StorageGetter} storageGetter
 * @param {string[]} fields
 * @return {Function}
 * @private
 */
export default function useStorageInComponent( storageName, storageGetter, fields ) {
    return function( options, didMount ) {
        const storage = storageGetter( this.ctx.DI );
        const watchedFields = new Set();
        const proxy = {};
        const update = options( {
            [ storageName ]: proxy
        } );
        fields.forEach(
            field => Object.defineProperty( proxy, field, {
                enumerable: true,
                get: function() {
                    if ( !watchedFields.has( field ) ) {
                        watchedFields.add( field );
                        storage.addWatcher( field, update );
                    }
                    return storage[ field ];
                }
            } )
        );
        didMount( () => {
            return () => {
                watchedFields.forEach(
                    field => storage.removeWatcher( field, update )
                );
                watchedFields.clear();
            };
        } );
    };
}
