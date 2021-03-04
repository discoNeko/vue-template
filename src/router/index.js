import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

/**
 * vue-routerの仕様により、同一画面に遷移するとエラーが出るようになったため
 * 元のrouter関数にエラーハンドリングを持たせて上書きすることで対応
 * @see https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  return (onResolve || onReject) ?
    originalPush.call(this, location, onResolve, onReject) :
    originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/unauthenticated',
    name: 'Unauthenticated',
    component: loadComponent('Unauthenticated.vue'),
  },
  {
    path: '/error',
    name: 'Error',
    component: loadComponent('Error.vue'),
  },
  {
    path: '/notfound',
    name: 'NotFound',
    component: loadComponent('NotFound.vue'),
  },
  {
    path: '*',
    redirect: { name: 'NotFound' },
  },
]

/**
  * load component
  * @param {String} name コンポーネント名
  * @return {Promise} 遅延ロードするコンポーネント
  */
function loadComponent (name) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ '@/views/' + name)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

export default router

