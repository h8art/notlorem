import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jwt: localStorage['jwt'],
    docViwerDrawer: false,
    actualDoc: {
      title: '',
      url: ''
    },
    user: {
      id: 1,
      first_name: "Artem",
      middle_name: "Michailovich",
      last_name: "Gershteyn",
      avatar: ""
    },
    votes: [{
      key: '123',
      id: "123",
      title: "Очень важноe голосованиие",
      creator: {
        first_name: "Artem",
        middle_name: "Michailovich",
        last_name: "Gershteyn",
        avatar: ""
      },
      description: "Голосования за то что я пидорГолосования за то что я пидорГолосования за то что я пидорГолосования за то что я пидорГолосования за то что я пидорГолосования за то что я пидор",
      participants: [{
        first_name: "Artem",
        middle_name: "Michailovich",
        last_name: "Gershteyn",
        avatar: ""
      }],
      deadline: new Date(),
      topics: [{
        title: "Почему я пидор?",
        voices: [{
          user: {
            first_name: "Artem",
            middle_name: "Michailovich",
            last_name: "Gershteyn",
            avatar: ""
          }
        }]
      }]
    }]
  },
  mutations: {
    updateJWT(state, jwt) {
      localStorage['jwt'] = jwt
      state.jwt = jwt
    },
    openDocPreview(state, doc) {
      state.actualDoc = doc
      state.docViwerDrawer = true
    },
    closeDocViewer(state) {
      state.docViwerDrawer = false
      state.actualDoc = {
        title: '',
        url: ''
      }
    }
  },
  actions: {

  }
})
