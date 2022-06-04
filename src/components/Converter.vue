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
            <div class="center-full" style="width: 100%;justify-content: flex-start;">
                <span style="font-size:15px;word-wrap: break-word;width:20%">Auto-Nesting (Beta and only for sass to scss)</span>
                <input type="checkbox" v-model="nestingtoggle" @change="inputChange()" style="margin-right:3vw;">
                To: <strong>{{ outputLanguage }}</strong>
            </div>
        </div>
        <div class="hbox grow" style="position: relative">
            <div class="editor">
              <b-button squared
                        title="Upload file"
                        variant="primary"
                        @click="uploadFile()"
                        class="file-upload-button"
              >
                <fa-icon :icon="['fas', 'upload']" />
              </b-button>
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
import { Component, Vue } from 'vue-property-decorator';
import { convertSassToScss } from '@/util/convertSassToScss';
import { convertScssToSass } from '@/util/convertScssToSass';
import { downloadTextAsFile } from '@/util/downloadTextAsFile';
import { uploadTextFile } from '@/util/uploadTextFile';

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

  public downloadFileName = 'style';

  public nestingtoggle = false;

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
        if (this.nestingtoggle) {
          this.output = this.autoNester(this.output);
        }        
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

  async uploadFile() {
    const { name, extension, content } = await uploadTextFile();
    if (extension !== this.inputLanguage.toLocaleLowerCase()) {
      await this.switchLanguages();
    }
    this.input = content;
    this.downloadFileName = name;
    await this.inputChange();
  }

  downloadOutputAsFile() {
    downloadTextAsFile(`${this.downloadFileName}.${this.outputLanguage.toLocaleLowerCase()}`, this.output);
  }

  autoNester(content : string) {
    let lines : string[] = content.split(/[\n]+/); // split into blocks
    let blocks = [];
    let block = [];
    let blockflag = false;
    for (const line of lines) {
      if (line.slice(line.length - 1) === "{") {
        block.push("  " + line);
        blockflag = true;
      }
      else if (line.slice(line.length - 1) === "}") {
        block.push("  " + line);
        blockflag = false;
        blocks.push(block.join("\n"));
        block = [];
      }
      else if (blockflag) {
        block.push("  " + line);
      }
      else {
        blocks.push(line);
      }
    }

    let selectors = [];
    for (const block of blocks) {
      const selector = block.split("{")[0].trimStart().split(" "); //get what is left of { since that is selector, then split that into array elements
      selectors.push(selector.slice(0,-1)); //last element is an "" so we don't want that
    }

    let branches : any = {};
    let untouched_blocks = [];
    for (const [index,selector] of selectors.entries()) { //this syntax gets value and index of array elements like python enumerate
      const key = selector[0];
      if (selector.length > 1) {
        if (key in branches) {       
          branches[key].push([selector[1],index]);        
        } 
        else {
          branches[key] = [[selector[1],index]];
        }         
      }      
      else {
        untouched_blocks.push(index);
      }
    }

    let newcontent = "";
    for (let index of untouched_blocks) {
      newcontent += blocks[index] + "\n";
    }
    newcontent += "\n";
    for (let root in branches) {
      newcontent += root + " {\n";

      for (let branch of branches[root]) {
        newcontent += ` ${blocks[branch[1]].substring(root.length + 2).replaceAll('\n','  \n')}\n`; //branch[1] is the index of the selector in blocks
      }

      newcontent += "}";
    }
    return newcontent;
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
        position: relative

        .file-upload-button
          position: absolute
          right: 0

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
