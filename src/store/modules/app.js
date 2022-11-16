const app = {
  state: {
    num:0
  },
  mutations: {
    setNum(state) {
      state.num++
    },
    incrementNum(state, args) {
      console.log(state,args)
      state.num+=args
    }
  },
  actions: {
    incrementAsync(store,args) {
      store.commit('incrementNum',args)
    }
  },
  namespaced:true
}

export default app