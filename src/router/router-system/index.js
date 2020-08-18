// 会员管理
const Main = resolve => require(['_c/main'], resolve);
let systemRouter = [
  {
    path: '/system-manage',
    name: 'system-manage',
    meta: {
      icon: 'md-settings',
      showAlways: true,
      title: '系统管理',
      authCode: 'system-manage'
    },
    component: Main,
    children: [
      {
        path: 'user-manage',
        name: 'user-manage',
        meta: {
          icon: 'md-person',
          title: '用户管理',
          authCode: 'user-manage'
        },
        component: () => import('@/view/system-manage/user-manage/index.vue')
      }
    ]
  }
];

export { systemRouter };
