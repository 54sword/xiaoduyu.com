// 路径别名配置
// 使用方法
// import { loadReportTypes, addReport } from '@actions/report';

module.exports = {
  '@config': 'config',
  // 模块
  '@modules': 'src/app/modules',
  // 组件
  '@components': 'src/app/components',
  // redux actions
  '@actions': 'src/app/store/actions',
  // redux reducers
  '@reducers': 'src/app/store/reducers',
  // 工具
  '@utils': 'src/app/common'
}