import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import VuePrismEditor from 'vue-prism-editor';

import 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

import 'vue-prism-editor/dist/VuePrismEditor.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faArrowLeft, faArrowRight, faCheck, faClipboard, faDownload, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import VueClipboard from 'vue-clipboard2';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import App from './App.vue';

// hack:
(process as any).version = '1.0.0';

// Fontawesome:
library.add(/* faArrowsAltH, */faClipboard, faCheck, faDownload,
  faArrowRight, faArrowLeft, faGithub, faExclamationTriangle);
Vue.component('fa-icon', FontAwesomeIcon);

Vue.use(VueClipboard);

// console.clear();

Vue.config.productionTip = false; // import the styles
Vue.component('prism-editor', VuePrismEditor);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
