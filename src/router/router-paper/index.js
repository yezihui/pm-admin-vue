const Main = resolve => require(['_c/main'], resolve);
let childrenArr = [
  {
    path: 'paper-manage',
    name: 'paper-manage',
    meta: {
      icon: 'md-book',
      title: '纸张管理',
      authCode: 'paper-manage'
    },
    component: () => import('@/view/paper-center/paper-manage/index.vue')
  },
  {
    path: 'sample-apply',
    name: 'sample-apply',
    meta: {
      icon: 'md-book',
      title: '取样申请',
      authCode: 'sample-apply'
    },
    component: () => import('@/view/paper-center/sample-apply/index.vue')
  }
];

let routerPaper = [
  {
    path: '/paper-center',
    name: 'paper-center',
    meta: {
      icon: 'md-bookmarks',
      showAlways: true,
      title: '纸张中心',
      authCode: 'paper-manage'
    },
    component: Main,
    children: childrenArr // 项目中心子路由
  }
];

export { routerPaper };
