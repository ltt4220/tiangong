const getters = {
    money: (state)=>(id=1)=> {
        
        return`￥${state.app.num+=id * 10}`
    },
    doneTodosCount: (state,getters) => {
        console.log(state,"dsdd",getters)
        return getters.money()
    }
}
export default getters