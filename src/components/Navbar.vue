<template>
    <b-navbar type="dark" variant="primary">
        <b-navbar-brand>
            Sass-to-SCSS Converter
            [Beta]
            <a class="made-by" href="https://github.com/ManuelSch/sass-scss-converter">
                by ManuelSch
            </a>
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto">
            <b-button href="https://github.com/ManuelSch/sass-scss-converter/issues">
                <fa-icon :icon="['fas', 'exclamation-triangle']" />
                Report a bug
            </b-button>
            <b-button href="https://github.com/ManuelSch/sass-scss-converter" style="color: white" variant="link">
                <fa-icon :icon="['fab', 'github']" />
                View sources
            </b-button>
        </b-navbar-nav>
    </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Navbar extends Vue {

}
</script>

<style lang="sass">
.made-by
    color: white
    font-size: 70%
    opacity: 0.7
    margin-left: .5rem
</style>
