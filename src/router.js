import Vue from 'vue'
import Router from 'vue-router'
import Votes from './views/Votes/index.vue'
import Vote from './views/Vote/index.vue'
import AddVote from './views/AddVote/index.vue'
import Login from './views/Login/index.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/votes',
      name: 'votes',
      component: Votes
    },{
      path: '/vote/:id',
      name: 'vote',
      component: Vote
    },{
      path: '/add',
      name: 'add vote',
      component: AddVote
    },{
      path: '/login',
      name: 'Login',
      component: Login
    },
  ]
})
