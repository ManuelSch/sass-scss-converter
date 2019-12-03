<template>
    <div class="editors vbox">
        <div class="header-bar hbox">
            <div class="center-full" style="width: 100%">
                From: <strong>{{ inputLanguage }}</strong>
            </div>
            <div>
                <b-button size="sm"
                          variant="outline-secondary"
                          style="white-space: nowrap"
                          @click="switchLanguages()"
                    >
                    <fa-icon :icon="['fas', 'arrow-left']" class="mb-1" /> Switch <fa-icon :icon="['fas', 'arrow-right']" class="mb-1" />
                </b-button>
            </div>
            <div class="center-full" style="width: 100%">
                To: <strong>{{ outputLanguage }}</strong>
            </div>
        </div>
        <div class="hbox grow" style="position: relative">
            <div class="editor">
                <prism-editor v-model="input"
                              emit-events
                              language="css"
                              line-numbers
                              @change="inputChange"
                    />
            </div>
            <div class="editor output-editor copy-all">
                <div v-if="output && output !== MALFORMED_INPUT_OUTPUT" class="output-buttons">
                    <b-button title="Download as file"
                              squared
                              variant="primary"
                              @click="downloadOutputAsFile()"
                        >
                        <fa-icon :icon="['fas', 'download']" />
                    </b-button>
                    <b-button class="clipboard-button"
                              title="Copy to clipboard"
                              squared
                              variant="primary"
                              @click="copyOutputToClipboard()"
                        >
                        <fa-icon :icon="['fas', 'clipboard']" />
                    </b-button>
                </div>
                <div style="position: absolute; right: 0">
                    <b-toast id="clipboard-toast"
                             variant="success"
                             auto-hide-delay="1000"
                             static
                        >
                        <strong>Copied to clipboard</strong> <fa-icon :icon="['fas', 'check']" class="mb-1" />
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
import { downloadTextAsFile } from '@/util/downloadTextAsFile';

@Component<Converter>({
    watch: {
        inputLanguage() {
            localStorage.setItem('inputLanguage', this.inputLanguage);
        },
    },
})
export default class Converter extends Vue {

    public MALFORMED_INPUT_OUTPUT = 'malformed input...';

    public inputLanguage: 'Sass' | 'SCSS' = 'Sass';

    public input: string = '';

    get outputLanguage(): 'Sass' | 'SCSS' {
        return this.inputLanguage === 'Sass' ? 'SCSS' : 'Sass';
    }

    public output: string = '';

    created() {
        const storedInputLanguage = localStorage.getItem('inputLanguage');
        if (storedInputLanguage === 'Sass' || storedInputLanguage === 'SCSS') {
            this.inputLanguage = storedInputLanguage;
        }
    }

    switchLanguages() {
        this.inputLanguage = this.outputLanguage;
        this.input = this.output === this.MALFORMED_INPUT_OUTPUT ? '' : this.output;
    }

    async inputChange() {

        this.input = `${this.input.trim()}\n\n`;

        try {
            if (this.inputLanguage === 'Sass') {
                this.output = await convertSassToScss(this.input);
            }
            else {
                this.output = await convertScssToSass(this.input);
            }
        }
        catch (e) {
            this.output = this.MALFORMED_INPUT_OUTPUT;
        }

    }

    async copyOutputToClipboard() {
        await this.$copyText(this.output);
        (this as any).$bvToast.show('clipboard-toast');
    }

    downloadOutputAsFile() {
        downloadTextAsFile(`style.${this.outputLanguage}`, this.output);
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="sass">
    @import "../styles/imports"

    .editors
        height: 100%
        padding: 1rem

        .header-bar
            font-size: 100%

            strong
                display: inline-block
                margin-left: 0.5rem

        .editor
            width: 100%
            max-width: calc(50% - .5rem)

        .output-editor
            position: relative

            .output-buttons
                position: absolute
                right: 0
                top: 0

                > * + *
                    margin-left: 1px

    .vbox
        > div + div
            margin-top: 1rem

    .hbox
        > div + div
            margin-left: 1rem

    //.copy-all ::v-deep pre
    //    -webkit-user-select: all  /* Chrome all / Safari all */
    //    -moz-user-select: all     /* Firefox all */
    //    -ms-user-select: all      /* IE 10+ */
    //    user-select: all          /* Likely future */

    #clipboard-toast__toast_outer ::v-deep .toast-header
        display: none
</style>
