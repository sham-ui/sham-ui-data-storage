import * as directives from 'sham-ui-directives';
import { storage } from '../storages/user';
import App from '../components/App.sfc';

export default function() {
    new App( {
        directives,
        ID: 'app',
        container: document.querySelector( 'body' ),
        onInputName( e ) {
            e.preventDefault();
            storage.name = e.target.value;
        }
    } );
}
