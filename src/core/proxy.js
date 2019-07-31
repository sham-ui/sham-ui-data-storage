/**
 * Create proxy storage for component
 * @param {Object} component
 * @param {Storage} storage
 * @param {String[]} fields
 * @return {{proxy: {}, destroy: (function())}}
 */
export default function createProxy( component, storage, fields ) {
    const update = component.update.bind( component );
    const watchedFields = new Set();
    const proxy = {};
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
    return {
        proxy,
        destroy() {
            watchedFields.forEach(
                field => storage.removeWatcher( field, update )
            );
            watchedFields.clear();
        }
    };
}
