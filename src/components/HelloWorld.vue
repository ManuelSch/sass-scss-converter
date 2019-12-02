<template>
    <div class="editors hbox">
        <div class="vbox">
            <span>{{ inputLanguage }}</span>
            <prism-editor v-model="textInput"
                          emit-events
                          language="css"
                          class="grow"
                />
        </div>
        <div class="vbox">
            <span>{{ outputLanguage }}</span>
            <prism-editor v-model="output"
                          emit-events
                          language="css"
                          readonly
                />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {

    public inputLanguage: 'sass' | 'scss' = 'sass';

    public textInput: string = '';

    get outputLanguage() {
        return this.inputLanguage === 'sass' ? 'scss' : 'sass';
    }

    get output() {
        return '';
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
    .editors
        height: 100%
        padding: 1rem

    .hbox
        > div
            width: 100%
            height: 100%

        > div + div
            margin-left: 1rem

</style>
