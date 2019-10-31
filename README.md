# sham-ui-data-storage

[![Build Status](https://travis-ci.com/sham-ui/sham-ui-data-storage.svg?branch=master)](https://travis-ci.com/sham-ui/sham-ui-data-storage)
[![npm version](https://badge.fury.io/js/sham-ui-data-storage.svg)](https://badge.fury.io/js/sham-ui-data-storage)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

 Data storage for sham-ui

## Install
```bash
# npm
npm install -D sham-ui-data-storage
```

```bash
# yarn
yarn add sham-ui-data-storage --dev
```

## API

## Usage
Create storage:
```js
// storages/session.js
import createStorage from 'sham-ui-data-storage';

export const { storage, useStorage } = createStorage( {
    name: '',
    email: '',
    sessionValidated: false,
    isAuthenticated: false
}, { DI: 'session:storage' } );
```
Use storage data in component:
```html
<template>
    <span class="logged-name">
        {{sessionData.name}}
    </span>
</template>

<script>
    import { useStorage } from '../../../storages/session';

    @useStorage( 'sessionData' )
    class Profile extends Template {
        
    }

    export default Profile;
</script>

```
