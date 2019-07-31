# sham-ui-data-storage

> Data storage for sham-ui

## Install
```bash
# npm
npm install sham-ui-data-storage
```

```bash
# yarn
yarn add sham-ui-data-storage
```

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