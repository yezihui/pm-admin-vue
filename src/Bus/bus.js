import Vue from 'vue';
let bus = new Vue();
let detailids = Vue.observable({ ids: [] });
let sellItem = Vue.observable({ items: {} });
let articleDetai = Vue.observable({ aDetai: null });
let downloadStatus = Vue.observable({ status: false });
export { bus, detailids, sellItem, articleDetai, downloadStatus };
