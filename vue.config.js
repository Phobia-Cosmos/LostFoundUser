const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8085
  },
  chainWebpack: config =>{
    config.plugin('html')
        .tap(args => {
          args[0].title = "失物招领系统";
          return args;
        })
  }
})
