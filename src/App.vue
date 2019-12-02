<template>
    <div id="app">
        <b-navbar type="dark" variant="primary">
            <b-navbar-brand>
                Sass-to-SCSS Converter
            </b-navbar-brand>
        </b-navbar>
        <Converter />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Converter from './components/Converter.vue';

    @Component({
        components: {
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
