<template>
    <div id="app">
        <navbar />
        <Converter />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Converter from './components/Converter.vue';
import Navbar from '@/components/Navbar.vue';

    @Component({
        components: {
            Navbar,
            Converter,
        },
    })
export default class App extends Vue {}
</script>

<style lang="scss">
    @import "styles/main";

    #app {
        height: calc(100% - 56px);
    }
</style>
