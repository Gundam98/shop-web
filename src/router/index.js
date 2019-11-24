import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/WantToBuy",
        name: "WantToBuy",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ("../views/WantToBuy.vue")
    },
    {
        path: "/Profile",
        name: "Profile",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/Profile.vue")
    },
    {
        path: "/SellGoods",
        name: "SellGoods",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/SellGoods.vue")
    },
    {
        path: "/wantToBuyGoods",
        name: "WantToBuyGoods",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/WantToBuyGoods.vue")
    },
    {
        path: "/Login",
        name: "Login",

        component: () =>
            import ("../views/Login.vue")
    },
    {
        path: "/Register",
        name: "Register",
        component: () =>
            import ("../views/Register.vue")
    },
    {
        path: "/Deposit",
        name: "Deposit",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/Deposit.vue")
    },
    {
        path: "/Mine",
        name: "Mine",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/Mine.vue")
    },
    {
        path: "/AllGoods",
        name: "AllGoods",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/AllGoods.vue")
    },
    {
        path: "/Goods/:id",
        name: "Goods",
        component: () =>
            import ("../views/Goods.vue")
    }
];

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {
        // 判断是否需要登录权限
        if (localStorage.getItem("username")) {
            // 判断是否登录
            next();
        } else {
            // 没登录则跳转到登录界面
            next({
                path: "/Login",
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }
});

export default router;