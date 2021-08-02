module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 192, //假设设计稿为1920
            propList: ['*']
        }
    }
}