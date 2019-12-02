<template>
    <div class="editors vbox">
        <div class="hbox">
            <div class="center-full" style="width: 100%">
                From: <strong>{{ inputLanguage }}</strong>
            </div>
            <div>
                <b-button size="sm" variant="outline-secondary" @click="switchLanguages()">
                    <fa-icon :icon="['fas', 'arrows-alt-h']" />
                </b-button>
            </div>
            <div class="center-full" style="width: 100%">
                To: <strong>{{ outputLanguage }}</strong>
            </div>
        </div>
        <div class="hbox grow">
            <div class="editor">
                <prism-editor v-model="input"
                              emit-events
                              language="css"
                              @change="inputChange"
                    />
            </div>
            <div class="editor output-editor copy-all">
                <b-button class="clipboard-button"
                          title="Copy to clipboard"
                          squared
                          @click="copyOutputToClipboard()"
                    >
                    <fa-icon :icon="['fas', 'clipboard']" />
                </b-button>
                <div style="position: absolute; right: 0">
                    <b-toast id="clipboard-toast"
                             variant="success"
                             auto-hide-delay="1000"
                             static
                        >
                        <strong>Copied to clipboard</strong> <fa-icon :icon="['fas', 'check']" />
                    </b-toast>
                </div>
                <prism-editor v-model="output"
                              emit-events
                              language="css"
                              readonly
                    />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { convertSassToScss } from '@/util/convertSassToScss';
import { convertScssToSass } from '@/util/convertScssToSass';
import { formatSass } from '@/util/formatSass';
import { formatScss } from '@/util/formatScss';


@Component
export default class HelloWorld extends Vue {

    public inputLanguage: 'Sass' | 'SCSS' = 'Sass';

    public input: string = '';

    get outputLanguage(): 'Sass' | 'SCSS' {
        return this.inputLanguage === 'Sass' ? 'SCSS' : 'Sass';
    }

    public output: string = '';

    switchLanguages() {
        this.inputLanguage = this.outputLanguage;
        this.input = this.output;
    }

    async inputChange() {

        this.input = `${this.input.trim()}\n\n`;

        try {
            if (this.inputLanguage === 'Sass') {
                this.input = formatSass(this.input);
                this.output = await convertSassToScss(this.input);
            }
            else {
                this.input = formatScss(this.input);
                this.output = await convertScssToSass(this.input);
            }
        }
        catch (e) {
            this.output = 'malformed input...';
        }

    }

    async copyOutputToClipboard() {
        await this.$copyText(this.output);
        (this as any).$bvToast.show('clipboard-toast');
        // TODO: show message
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
    .editors
        height: 100%
        padding: 1rem

        .editor
            width: 100%
            max-width: calc(50% - .5rem)

        .output-editor
            position: relative

            .clipboard-button
                position: absolute
                right: 0
                top: 0

    .vbox
        > div + div
            margin-top: 1rem

    .hbox
        > div + div
            margin-left: 1rem

    .copy-all ::v-deep pre
        -webkit-user-select: all  /* Chrome all / Safari all */
        -moz-user-select: all     /* Firefox all */
        -ms-user-select: all      /* IE 10+ */
        user-select: all          /* Likely future */

    #clipboard-toast__toast_outer ::v-deep .toast-header
        display: none
</style>
