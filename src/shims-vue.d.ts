declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'vue-prism-editor' {
    export type PrismEditor = unknown;
}

declare module 'prismjs/*' {
    export default any;
}

declare module 'sast' {
    const sast: unknown;

    export default sast;
}

declare module 'sass-formatter' {
    export const SassFormatter: any;
    export const SassTextDocument: any;
}
