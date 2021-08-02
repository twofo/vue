export default {
    //存储数据
    state: {
        currentMenu: null,
        tabsList: [{
            path: '/',
            name: 'index',
            label: '首页',
        }]
    },
    //调用方法
    mutations: {
        //选择标签 选择面包屑
        selectMenu(state, val) {
            if (val.name === 'index') {
                state.currentMenu = null
            } else {
                state.currentMenu = val
                //如果等于-1说明tabsList不存在那么插入，否则什么都不做
                let result = state.tabsList.findIndex(item => item.name === val.name)
                result === -1 ? state.tabsList.push(val) : ''
            }
        },
        //关闭标签
        closeTab(state, val) {
            let result = state.tabsList.findIndex(item => item.name === val.name)
            state.tabsList.splice(result, 1)
        },
        AllClose(state) {
            state.tabsList = [{
                path: '/',
                name: 'index',
                label: '首页',
            }]
        }
    },
    actions: {}
}