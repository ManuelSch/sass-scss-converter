import Vue from 'vue';
import VuePrismEditor from 'vue-prism-editor';
import App from './App.vue';

import 'prismjs';
import 'prismjs/themes/prism.css';

import 'vue-prism-editor/dist/VuePrismEditor.css';


Vue.config.productionTip = false; // import the styles
Vue.component('prism-editor', VuePrismEditor);

new Vue({
    render: h => h(App),
}).$mount('#app');
