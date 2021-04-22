import { createDI } from 'sham-ui';

import createStorage from '../../src/index';

describe( 'base', () => {
    const DEFAULT_FIRST_NAME = 'John';
    const DEFAULT_LAST_NAME = 'Smith';

    let storage;

    beforeEach( () => {
        storage = createStorage( {
            firstName: DEFAULT_FIRST_NAME,
            lastName: DEFAULT_LAST_NAME
        } ).storage( createDI() );
    } );

    it( 'default values', () => {
        expect( storage.firstName ).toBe( DEFAULT_FIRST_NAME );
        expect( storage.lastName ).toBe( DEFAULT_LAST_NAME );
    } );

    it( 'enumerable only fields', () => {
        expect( Object.keys( storage ).sort() ).toEqual( [ 'firstName', 'lastName' ] );
    } );

    it( 'set value', () => {
        storage.firstName = 'Adam';
        expect( storage.firstName ).toBe( 'Adam' );
        expect( storage.lastName ).toBe( DEFAULT_LAST_NAME );
        storage.lastName = 'Hans';
        expect( storage.lastName ).toBe( 'Hans' );
    } );

    it( 'reset', () => {
        storage.firstName = 'Adam';
        storage.lastName = 'Hans';
        storage.reset();
        expect( storage.firstName ).toBe( DEFAULT_FIRST_NAME );
        expect( storage.lastName ).toBe( DEFAULT_LAST_NAME );
    } );

    it( 'async run deferred watcher callback', async() => {
        expect.assertions( 3 );
        const calls = [];
        storage.addWatcher( 'firstName', () => calls.push( 'first inserted' ) );
        storage.firstName = 'Adam';
        expect( storage.firstName ).toBe( 'Adam' );
        expect( calls ).toEqual( [] );
        await new Promise( resolve => setImmediate( resolve ) );
        expect( calls ).toEqual( [ 'first inserted' ] );
    } );

    it( 'callback call in insert order (FIFO)', () => {
        const calls = [];
        storage.addWatcher( 'firstName', () => calls.push( 'first inserted' ) );
        storage.addWatcher( 'firstName', () => calls.push( 'second inserted' ) );
        storage.firstName = 'Adam';
        storage.sync();
        expect( calls ).toEqual( [ 'first inserted', 'second inserted' ] );
    } );

    it( 'callback call in reverse insert order (LIFO)', () => {
        const calls = [];
        const storage = createStorage( {
            firstName: DEFAULT_FIRST_NAME,
            lastName: DEFAULT_LAST_NAME
        }, { LIFO: true } ).storage( createDI() );
        storage.addWatcher( 'firstName', () => calls.push( 'first inserted' ) );
        storage.addWatcher( 'firstName', () => calls.push( 'second inserted' ) );
        storage.firstName = 'Adam';
        storage.sync();
        expect( calls ).toEqual( [ 'second inserted', 'first inserted' ] );
    } );

    it( 'disable async with sync options', async() => {
        expect.assertions( 4 );
        const calls = [];
        const storage = createStorage( {
            firstName: DEFAULT_FIRST_NAME,
            lastName: DEFAULT_LAST_NAME
        }, { sync: true } ).storage( createDI() );
        storage.addWatcher( 'firstName', () => calls.push( 'first inserted' ) );
        storage.addWatcher( 'firstName', () => calls.push( 'second inserted' ) );
        storage.firstName = 'Adam';
        expect( storage.firstName ).toBe( 'Adam' );
        expect( calls ).toEqual( [] );
        await new Promise( resolve => setImmediate( resolve ) );
        expect( calls ).toEqual( [] );
        storage.sync();
        expect( calls ).toEqual( [ 'first inserted', 'second inserted' ] );
    } );
} );

describe( 'di', () => {
    it( 'registry', () => {
        const DI = createDI();
        const { storage } = createStorage( {}, { DI: 'storage:foo' } );
        expect( storage( DI ) ).toBe( DI.resolve( 'storage:foo' ) );
    } );
} );
