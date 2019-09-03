import renderer, { compileAsSFC, compile } from 'sham-ui-test-helpers';
import createStorage from '../../src/index';

describe( 'component', () => {
    const updating = () => new Promise( resolve => setImmediate( resolve ) );

    it( 'base', async() => {
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

    it( 'remove', async() => {
        const { storage, useStorage }  = createStorage( {
            firstName: 'John',
            lastName: 'Smith'
        } );

        const UserInfoComponent = compileAsSFC( {
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
        `;

        const meta = renderer(
            compile( {
                UserInfo: UserInfoComponent
            } )`
                {% if test %}
                    <UserInfo/>
                {% endif %}
            `,
            {
                test: true
            }
        );
        expect( meta.toJSON() ).toMatchSnapshot( 'initial' );
        storage.firstName = 'Jordan';
        await updating();
        expect( meta.toJSON() ).toMatchSnapshot( 'after update firstName' );
        meta.component.update( {
            test: false
        } );
        expect( meta.toJSON() ).toMatchSnapshot( 'test === false' );
        storage.lastName = 'Shah';
        await updating();
        expect( meta.toJSON() ).toMatchSnapshot( 'after update lastName' );
        meta.component.update( {
            test: true
        } );
        expect( meta.toJSON() ).toMatchSnapshot( 'test === true' );
        storage.firstName = 'John';
        storage.lastName = 'Smith';
        await updating();
        expect( meta.toJSON() ).toMatchSnapshot( 'after firstName & lastName' );
    } );

    it( 'sync', () => {
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
        storage.firstName = 'Jordan';
        expect( meta.toJSON() ).toMatchSnapshot( 'after update firstName' );
        storage.sync();
        expect( meta.toJSON() ).toMatchSnapshot( 'after update firstName & wait updating' );
        storage.lastName = 'Shah';
        expect( meta.toJSON() ).toMatchSnapshot( 'after update lastName' );
        expect( meta.toJSON() ).toMatchSnapshot( 'after update lastName & wait updating' );
        storage.lastName = 'Shah';
        storage.sync();
        expect( meta.toJSON() ).toMatchSnapshot( 'lastName don\'t changed' );
    } );

} );
