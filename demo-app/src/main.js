import { createDI, start } from 'sham-ui';
import mainInitializer from './initializers/main';

if ( module.hot ) {
    if ( window.DI ) {
        const store = window.DI.resolve( 'sham-ui:store' );
        const app = store.findById( 'app' );
        if ( undefined !== app ) {
            app.remove();
            store.forEach( component => {
                try {
                    component.remove();
                } catch ( e ) {
                    // eslint-disable-next-line no-empty
                }
            } );
        }
    }
    module.hot.accept();
}

const DI = createDI();

window.DI = DI;

mainInitializer( DI );
start( DI );
