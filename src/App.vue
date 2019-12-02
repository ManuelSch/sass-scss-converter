<template>
    <div id="app">
        <b-navbar type="dark" variant="primary">
            <b-navbar-brand href="#">
                Convert Sass to SCSS
            </b-navbar-brand>
        </b-navbar>
        <HelloWorld />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

    @Component({
        components: {
            HelloWorld,
        },
    })
export default class App extends Vue {}
</script>

<style lang="scss">
    @import "styles/main";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;

        height: calc(100% - 56px);
    }
</style>
