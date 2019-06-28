import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

import { Button, Switch, Pagination, Radio, Input, Dialog, Message, MessageBox, Header, Container, Main, Select, Option, Table, TableColumn} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Button)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Radio)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Header)
Vue.use(Container)
Vue.use(Main)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)

Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

// axios.defaults.baseURL = config.SERVE_URL;
Vue.prototype.__Axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
