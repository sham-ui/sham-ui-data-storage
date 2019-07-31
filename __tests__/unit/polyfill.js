const { setImmediate } = window;
const updating = () => new Promise( resolve => setTimeout( resolve ) );

beforeAll( () => {
    delete window.setImmediate;
} );

afterAll( () => {
    window.setImmediate = setImmediate;
} );

import renderer, { compileAsSFC } from 'sham-ui-test-helpers';
import createStorage from '../../src/index';


it( 'with setImmediate polyfill', async() => {
    const { storage, useStorage }  = createStorage( {
        firstName: 'John',
        lastName: 'Smith'
    } );

    const meta = renderer(
        compileAsSFC( {
            useStorage
        } )`
            <template>
                <dl>
                    <dt>First name</dt>
                    <dd>{{user.firstName}}</dd>
                    <dt>Last name</dt>
                    <dd>{{user.lastName}}</dd>
                </dl>
            </template>
            <script>
                @useStorage( 'user' )
                class Component extends Template {}
                export default Component;
            </script>
        `
    );
    expect( meta.toJSON() ).toMatchSnapshot( 'initial' );
    storage.firstName = 'Jordan';
    expect( meta.toJSON() ).toMatchSnapshot( 'after update firstName' );
    await updating();
    expect( meta.toJSON() ).toMatchSnapshot( 'after update firstName & wait updating' );
    storage.lastName = 'Shah';
    expect( meta.toJSON() ).toMatchSnapshot( 'after update lastName' );
    expect( meta.toJSON() ).toMatchSnapshot( 'after update lastName & wait updating' );
    storage.lastName = 'Shah';
    await updating();
    expect( meta.toJSON() ).toMatchSnapshot( 'lastName don\'t changed' );
} );
