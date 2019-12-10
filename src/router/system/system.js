/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/system',
  component: Layout,
  redirect: '/system/systemMessage',
  name: 'system',
  meta: {
    title: '系统管理',
    icon: 'setting',
  },
  children: [{
    path: 'menuPermission',
    component: _import('systemManagement/menuPermission'),
    name: 'menuPermission',
    meta: {
      title: '菜单管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'appVersion',
    component: _import('systemManagement/appVersion'),
    name: 'appVersion',
    meta: {
      title: '版本管理'
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'systemMessage',
    component: _import('systemManagement/systemMessage'),
    name: 'systemMessage',
    meta: {
      title: '系统消息',
    }
  }, {
    path: 'shopMessage',
    component: _import('systemManagement/shopMessage'),
    name: 'shopMessage',
    meta: {
      title: '企业消息',
    }
  }, {
    path: 'storeMessage',
    component: _import('systemManagement/storeMessage'),
    name: 'storeMessage',
    meta: {
      title: '商户消息',
    }
  }, {
    path: 'otherMessage',
    component: _import('systemManagement/otherMessage'),
    name: 'otherMessage',
    meta: {
      title: '其他消息',
    }
  }, {
    path: 'messageTemplate',
    component: _import('systemManagement/messageTemplate'),
    name: 'messageTemplate',
    meta: {
      title: '消息模板',
    }
  }, {
    path: 'resource',
    component: _import('systemManagement/resource'),
    name: 'resource',
    meta: {
      title: '资源管理',
    }
  }, {
    path: 'fileDirectory',
    component: _import('systemManagement/fileDirectory'),
    name: 'fileDirectory',
    meta: {
      title: 'OSS文件管理',
    }
  }, {
    path: 'codeGenerator',
    component: _import('systemManagement/codeGenerator'),
    name: 'codeGenerator',
    meta: {
      title: '编码生成器',
    }
  }, {
    path: 'areaConfig',
    component: _import('systemManagement/areaConfig'),
    name: 'areaConfig',
    meta: {
      title: '区域配置',
    }
  }, {
    path: 'dictionary',
    component: _import('systemManagement/dictionary'),
    name: 'dictionary',
    meta: {
      title: '字典管理',
    }
  }, {
    path: 'serviceConfig',
    component: _import('systemManagement/serviceConfig'),
    name: 'serviceConfig',
    meta: {
      title: '系统业务参数',
    }
  }]
}
