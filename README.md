## Run 开发 
```bash
    # 安装依赖
    npm install
    //or # 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
    npm install -g cnpm -registry=https://registry.npm.taobao.org


    # 本地开发 开启服务
    # develop
    npm run dev
```
浏览器访问  http://host:prot 

```

## Build 发布
```bash
    # 发布预发布环境
    npm run build:sit   
    
    # 发布测试环境
    npm run build:test

    # 构建生成环境
    npm run build:prod


## FileTree 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 静态文件
│   ├── components             // 全局UI组件
│   ├── directive              // 指令
│   ├── filters                // 过滤器
│   ├── icons                  // icon图标
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 插件
│   ├── containers             // 自适应布局组合
│   ├── view                   // view 界面
│   │    ├── dashboard             // 首页
│   │    ├── errorPage             // 错误界面
│   │    ├── goodsManagement       // 商品管理
│   │    ├── layout                // 布局
│   │    ├── login                 // 登录界面
│   │    ├── memberManagement      // 会员管理
│   │    ├── orderManagement       // 订单管理
│   │    ├── storeManagement       // 店铺管理
│   │    ├── svg-icons             // icon组件
│   │    ├── systemManagement      // 系统管理
│   │    ├── userManagement        // 用户管理
│   │    └── permission        //权限测试界面
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 静态资源
│   ├── tinymce4.7.5           // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```