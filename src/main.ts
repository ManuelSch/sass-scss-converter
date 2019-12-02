import Vue from 'vue';
import VuePrismEditor from 'vue-prism-editor';
import Vuetify from 'vuetify';
import App from './App.vue';

import 'prismjs';
import 'prismjs/themes/prism.css';

import 'vue-prism-editor/dist/VuePrismEditor.css';
import vuetify from './plugins/vuetify';

Vue.use(Vuetify);

Vue.config.productionTip = false; // import the styles
Vue.component('prism-editor', VuePrismEditor);

new Vue({
    vuetify,
    render: h => h(App),
}).$mount('#app');
