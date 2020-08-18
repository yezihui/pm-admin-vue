<template>
  <Layout style="height: 100%" class="main" :class="mainTheme">
    <Sider
      hide-trigger
      collapsible
      :width="256"
      :collapsed-width="64"
      v-model="collapsed"
      class="left-sider"
      :style="{overflow: 'hidden'}"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo"/>
          <img v-show="collapsed" :src="minLogo" key="min-logo"/>-->
          <span v-show="!collapsed">怪村纸集运营系统</span>
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avatar="userAvatar" :user-name="userName" />
          <theme-change :theme-list="themeList" :seletedItem="seletedItem" class="mar_r-30" @onClick="onChangeTheme"></theme-change>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper">
            <!--防止activated生命周期失效-->
            <keep-alive :include="cacheList">
              <router-view v-if="isRouterAlive" />
            </keep-alive>
            <ABackTop :height="100" :bottom="65" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import TagsNav from './components/tags-nav';
import ThemeChange from './components/theme-change';
import User from './components/user';
import ABackTop from './components/a-back-top';
import { mapGetters, mapMutations } from 'vuex';
import { getNewTagList, routeEqual } from '@/libs/util';
import routers from '@/router/routers';
import minLogo from '@/assets/images/logo-min.png';
import maxLogo from '@/assets/images/logo.png';
import './main.less';

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    User,
    ThemeChange,
    ABackTop
  },
  // inject: ['reloadLyout'], 使用方式：在需要使用的页面注入人，然后直接调用
  provide() {
    return {
      reloadLyout: this.reloadLyout
    };
  },
  data() {
    return {
      isRouterAlive: true,
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      // seletedItem: process.env.VUE_APP_CURRENTMODE === 'dev' ? 1 : process.env.VUE_APP_CURRENTMODE === 'test' ? 2 : 0,
      themeList: [
        {
          name: '默认主题',
          value: 0,
          theme: 'theme-default'
        },
        {
          name: '粉色主题',
          value: 1,
          theme: 'theme-pink'
        },
        {
          name: '橙色主题',
          value: 2,
          theme: 'theme-orage'
        },
        {
          name: '环保主题',
          value: 3,
          theme: 'theme-green'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['errorCount', 'seletedItem']),
    mainTheme() {
      return this.themeList[this.seletedItem].theme
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvatar() {
      return this.$store.state.user.avatarIcon;
    },
    userName() {
      return this.$store.state.user.nickName;
    },
    cacheList() {
      if (!this.isRouterAlive) return []
      return [
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter(item => !(item.meta && item.meta.notCache))
              .map(item => item.name)
          : [])
      ];
    },
    menuList() {
      // return this.$store.getters.menuList //本地环境菜单
      // return this.$store.getters.userMenus //后台返回菜单
      return process.env.NODE_ENV === 'development'
        ? this.$store.getters.menuList
        : this.$store.getters.userMenus;
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setHomeRoute',
      'setActiveMenu',
      'closeTag',
      'getOperatorsFromMenus',
      'getSubOperatorsFromMenus',
      'setThemeItem'
    ]),
    reloadLyout() {
      console.log('reloadLyout');
      // this.isRouterAlive = false;
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     this.isRouterAlive = true
      //   }, 200)
      // });
    },
    onChangeTheme(v) {
      // this.seletedItem = v
      this.setThemeItem(v)
    },
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      if (name === this.$route.name) return
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      if (item.name === this.$route.name) {
        this.reloadLyout();
      } else {
        this.turnToPage(item);
      }
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      // 如果是登录则不需要加入tag标签
      if (name === 'login') return
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
      // 当路由菜单发生变化时候，加载更新当前菜单下权限列表（全局变量）
      // this.getOperatorsFromMenus(newRoute.name);
      this.getOperatorsFromMenus(newRoute.meta.authCode);
      this.getSubOperatorsFromMenus(newRoute.meta.subAuthCode);
    }
  },
  created() {
    // 在(父组件)实例创建完成后，加载当前菜单下所有权限列表到全局变量里面
    // this.getOperatorsFromMenus(this.$route.name);
    this.getOperatorsFromMenus(this.$route.meta.authCode);
    this.getSubOperatorsFromMenus(this.$route.meta.subAuthCode);
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.setHomeRoute(routers);
    const { name, params, query, meta } = this.$route;
    this.addTag({
      route: { name, params, query, meta }
    });
    // this.addTag({
    //   route: this.$store.state.app.homeRoute
    // })
    this.setBreadCrumb(this.$route);
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      });
    }
  }
};
</script>
