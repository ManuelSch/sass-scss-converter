<template>
    <div class="editors hbox">
        <div>
            <prism-editor v-model="textInput"
                          emit-events
                          :language="inputLanguage"
                />
        </div>
        <div>
            <prism-editor v-model="output"
                          emit-events
                          :language="outputLanguage"
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

<style scoped lang="sass">
    .editors
        height: 100%
        padding: 1rem

    .hbox
        > *
            width: 100%

        > * + *
            margin-left: 1rem

</style>
