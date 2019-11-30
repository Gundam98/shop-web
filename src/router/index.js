import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { MessageBox } from "element-ui";

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/Demand",
        name: "DemandHome",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ("../views/DemandHome.vue")
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
        path: "/EditGoods/:id",
        name: "EditGoods",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/SellGoods.vue")
    },
    {
        path: "/DemandGoods",
        name: "DemandGoods",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/DemandGoods.vue")
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
        path: "/MyBought",
        name: "MyBought",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/MyBought.vue")
    },
    {
        path: "/MySold",
        name: "MySold",
        meta: {
            requireAuth: true
        },
        component: () =>
            import ("../views/MySold.vue")
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
    },
    {
        path: "/Demand/:id",
        name: "Demand",
        component: () =>
            import ("../views/Demand.vue")
    },
    {
        path: "/MyDemand",
        name: "MyDemand",
        component: () => {
            import ("../views/MyDemand.vue");
        }
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
            MessageBox.alert("", "尚未登陆", {
                confirmButtonText: "确定",
                callback: () => {
                    next({
                        path: "/Login",
                        query: {
                            redirect: to.fullPath
                        }
                    });
                },
                type: "warning",
                center: "true"
            });
        }
    } else {
        next();
    }
});

export default router;