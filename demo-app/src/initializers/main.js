import * as directives from 'sham-ui-directives';
import { storage } from '../storages/user';
import App from '../components/App.sfc';

export default function( DI ) {
    const routeStorage = storage( DI );
    new App( {
        DI,
        directives,
        ID: 'app',
        container: document.querySelector( 'body' ),
        onInputName( e ) {
            e.preventDefault();
            routeStorage.name = e.target.value;
        }
    } );
}
