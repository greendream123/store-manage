import {createRouter, createWebHashHistory, createWebHistory} from "vue-router"
// layout
const Home  = () => import(/* webpackChunkName: "Home" */ './views/layout/home.vue')
// jwt
// const JwtChecker = () => import(/* webpackChunkName: "JwtChecker" */ '@/views/common/jwtchecker.vue')

const Dashboard = () => import ( /* webpackChunkName: "dashboard" */ "./views/Dashboard.vue")
const Login = () => import ( /* webpackChunkName: "login" */ "./views/login.vue")
// storage
const Products = () => import(/* webpackChunkName: "products" */ '@/views/products/products.vue')
const Drinks = () => import(/* webpackChunkName: "Drinks" */ '@/views/products/products-drinks.vue')
const Foods = () => import(/* webpackChunkName: "Foods" */ '@/views/products/products-foods.vue')
const Commodity = () => import(/* webpackChunkName: "Commodity" */ '@/views/products/products-commodity.vue')
// chart
const SaleChart = () => import(/* webpackChunkName: "SaleChart" */ '@/views/sale-overview/sale-chart.vue')
const ProfitChart = () => import(/* webpackChunkName: "ProfitChart" */ '@/views/sale-overview/profit-chart.vue')
const YearChart = () => import(/* webpackChunkName: "YearChart" */ '@/views/sale-overview/year-chart.vue')
// log
const SaleLog = () => import(/* webpackChunkName: "SaleLog" */ '@/views/logs/sale-log.vue')
const PurchaseLog = () => import(/* webpackChunkName: "PurchaseLog" */ '@/views/logs/purchase-log.vue')
// account
const Account = () => import(/* webpackChunkName: "Account" */ '@/views/account/account-manage.vue')

const routes = [
    { path: '/', redirect: '/login' },
    { path: "/login", name: "Login", meta: { title: 'login' }, component: Login },
    { path: "/home", name: "Home", redirect: '/dashboard', component: Home,
      children: [
        { path: "/dashboard", name: "dashboard", meta: { title: 'dashboard' }, component: Dashboard },
      ]
    },
    { 
      path: '/products', name: 'products', meta: { title: 'storage' }, component: Home,
      children: [
        { path: '/repertory', name: 'repertory', meta: { title: 'allProduct' }, component: Products },
        { path: '/drinks', name: 'drinks', meta: { title: 'drinks' }, component: Drinks },
        { path: '/foods', name: 'foods', meta: { title: 'foods' }, component: Foods },
        { path: '/commodity', name: 'commodity', meta: { title: 'commodity' }, component: Commodity },
      ]
    },
    {
      path: '/saleoverview', name: 'saleOverview', meta: { title: 'saleOverview' }, component: Home,
      children: [
        { path: '/salechart', name: 'saleChart', meta: { title: 'saleChart' }, component: SaleChart },
        { path: '/profitchart', name: 'profitChart', meta: { title: 'profitChart' }, component: ProfitChart },
        { path: '/yearchart', name: 'yearChart', meta: { title: 'yearChart' }, component: YearChart },
      ]
    },
    {
      path: '/log', name: 'logRecord', meta: { title: 'logRecord' }, component: Home,
      children: [
        { path: '/salelog', name: 'saleLog', meta: { title: 'saleLog' }, component: SaleLog },
        { path: '/purchaseLog', name: 'purchaseLog', meta: { title: 'purchaseLog' }, component: PurchaseLog },
      ]
    },
    { path: '/account', name: 'accountManage', meta: { title: 'accountManage' }, component: Home,
      children: [
        { path: "/account", name: "accountManage", meta: { title: 'accountManage' }, component: Account },
      ]
    },
    
];

const router = createRouter({
    history: createWebHashHistory(),
    // history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    // document.title = `${to.meta.title} | vue-manage-system`;
    const userInfo = JSON.parse(localStorage.getItem('loginedUser'))
    if (!userInfo && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        userInfo.role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});
export default router;