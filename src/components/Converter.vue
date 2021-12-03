<template>
    <div class="editors vbox">
        <div class="header-bar hbox">
            <div class="center-full" style="width: 100%">
                From: <strong>{{ inputLanguage }}</strong>
            </div>
            <div>
                <b-button size="sm"
                          style="white-space: nowrap"
                          variant="outline-secondary"
                          @click="switchLanguages()"
                    >
                    <fa-icon :icon="['fas', 'arrow-left']" class="mb-1" />
                    Switch
                    <fa-icon :icon="['fas', 'arrow-right']" class="mb-1" />
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
                <div v-if="showOutputButtons" class="output-buttons">
                    <b-button squared
                              title="Download as file"
                              variant="primary"
                              @click="downloadOutputAsFile()"
                        >
                        <fa-icon :icon="['fas', 'download']" />
                    </b-button>
                    <b-button class="clipboard-button"
                              squared
                              title="Copy to clipboard"
                              variant="primary"
                              @click="copyOutputToClipboard()"
                        >
                        <fa-icon :icon="['fas', 'clipboard']" />
                    </b-button>
                </div>
                <div style="position: absolute; right: 0">
                    <b-toast id="clipboard-toast"
                             auto-hide-delay="1000"
                             static
                             variant="success"
                        >
                        <strong>Copied to clipboard</strong>
                        <fa-icon :icon="['fas', 'check']" class="mb-1" />
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
import {Component, Vue} from 'vue-property-decorator';
import {convertSassToScss} from '@/util/convertSassToScss';
import {convertScssToSass} from '@/util/convertScssToSass';
import {downloadTextAsFile} from '@/util/downloadTextAsFile';

const DEFAULT_INPUT = `
@import "../styles/imports"

$col-primary: #f39900

=center_horizontal()
  display: flex
  justify-content: center

.container
  +center_horizontal()
  border: 1px solid darken($col-background, 10)
  .item
    color: $col-primary
`.trim();

const DEFAULT_INPUT_LANGUAGE = 'Sass';

@Component<Converter>({
  watch: {
    inputLanguage() {
      localStorage.setItem('sass-scss-converter_inputLanguage', this.inputLanguage);
    },
    input() {
      localStorage.setItem('sass-scss-converter_input', this.input);
    },
  },
})
export default class Converter extends Vue {
  public MALFORMED_INPUT_OUTPUT = 'malformed input...';

  public inputLanguage: 'Sass' | 'SCSS' = DEFAULT_INPUT_LANGUAGE;

  public input = DEFAULT_INPUT

  public output = '';

  get outputLanguage(): 'Sass' | 'SCSS' {
    return this.inputLanguage === 'Sass' ? 'SCSS' : 'Sass';
  }

  get showOutputButtons(): boolean {
    return !!(this.output && this.output.trim() && this.output !== this.MALFORMED_INPUT_OUTPUT);
  }

  created() {
    this.initializeInputLanguage();
    this.initializeInput();
    this.inputChange();
  }

  private initializeInputLanguage() {
    const storedInputLanguage = localStorage.getItem('sass-scss-converter_inputLanguage');
    if (storedInputLanguage === 'Sass' || storedInputLanguage === 'SCSS') {
      this.inputLanguage = storedInputLanguage;
    }
  }

  private initializeInput() {
    const storedInput = localStorage.getItem('sass-scss-converter_input');
    if (storedInput) {
      this.input = storedInput;
    }
  }

  async switchLanguages() {
    this.inputLanguage = this.outputLanguage;
    this.input = (this.output === this.MALFORMED_INPUT_OUTPUT ? '' : this.output).trim();
    await this.$nextTick();
    this.inputChange();
  }

  async inputChange() {
    try {
      if (this.inputLanguage === 'Sass') {
        this.output = await convertSassToScss(this.input);
      } else {
        this.output = await convertScssToSass(this.input);
      }
    } catch (e) {
      this.output = this.MALFORMED_INPUT_OUTPUT;
    }
  }

  async copyOutputToClipboard() {
    await this.$copyText(this.output);
    (this as any).$bvToast.show('clipboard-toast');
  }

  downloadOutputAsFile() {
    downloadTextAsFile(`style.${this.outputLanguage.toLocaleLowerCase()}`, this.output);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="sass" scoped>
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
