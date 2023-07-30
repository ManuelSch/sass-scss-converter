<template>
  <b-navbar toggleable="md" type="dark" variant="primary">
    <b-navbar-brand>
      Sass-to-SCSS Converter
      [Beta]
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-brand>
        <a class="made-by" href="https://github.com/ManuelSch/sass-scss-converter">
          by ManuelSch
        </a>
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button href="https://github.com/ManuelSch/sass-scss-converter/issues">
          <fa-icon :icon="['fas', 'exclamation-triangle']"/>
          Report a bug
        </b-button>
        <b-button href="https://github.com/ManuelSch/sass-scss-converter" style="color: white"
                  variant="link">
          <fa-icon :icon="['fab', 'github']"/>
          View sources
        </b-button>
        <a href="https://ko-fi.com/Q5Q3MZNCY" target="_blank">
          <img
            height="36"
            style="border:0; height:36px;"
            src="https://storage.ko-fi.com/cdn/kofi1.png?v=3"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </b-navbar-nav>
    </b-collapse>

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
</style>
