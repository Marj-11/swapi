import Vue from "vue";
import Router from "vue-router";
import Plot from "./components/Plot";
import Intro from "./components/Intro";


Vue.use(Router);

export default new Router({
    routes: [{
            path: "/",
            name: "Plot",
            component: Plot
        },
        {
            path: "/Intro",
            name: "Intro",
            component: Intro
        }
    ]
});