# api7-dashboard-components

用于存放常用组件，基于 [Ant Design Pro Components](https://github.com/ant-design/pro-components) 进行构建。

## 组件看板

| 组件 | 下载量 | 版本 |
| --- | --- | --- |
| ui | [![](https://img.shields.io/npm/dw/@api7-dashboard/ui.svg)](https://www.npmjs.com/package/@api7-dashboard/ui) | [![npm package](https://img.shields.io/npm/v/@api7-dashboard/ui.svg?style=flat-square?style=flat-square)](https://www.npmjs.com/package/@api7-dashboard/ui) |
| plugin | [![](https://img.shields.io/npm/dw/@api7-dashboard/plugin.svg)](https://www.npmjs.com/package/@api7-dashboard/plugin) | [![npm package](https://img.shields.io/npm/v/@api7-dashboard/plugin.svg?style=flat-square?style=flat-square)](https://www.npmjs.com/package/@api7-dashboard/plugin) |
| pluginchart | [![](https://img.shields.io/npm/dw/@api7-dashboard/pluginchart.svg)](https://www.npmjs.com/package/@api7-dashboard/pluginchart) | [![npm package](https://img.shields.io/npm/v/@api7-dashboard/pluginchart.svg?style=flat-square?style=flat-square)](https://www.npmjs.com/package/@api7-dashboard/pluginchart) |

## Usage

1. `/packages/boilerplate` 为模板组件所在目录，如需创建新组件，拷贝其目录并修改初始化文件即可；
2. 以 `/packages/boilerplate` 为例，该组件完整名称为 `@api7-dashboard/boilerplate`；

```sh
$ # 在根目录下进行构建

$ yarn install && yarn dev

$ cd /packages/boilerplate

$ yarn link

$ # 输出 Registered "@api7-dashboard/boilerplate" 表示链接成功

$ # 进入目标项目目录，如 apisix-dashboard

$ cd apisix-dashboard

$ yarn link @api7-dashboard/boilerplate

$ # 输出：success Using linked package for "@api7-dashboard/boilerplate". 表示绑定成功，在项目内可直接使用 import XXX from "@api7-dashboard/boilerplate"
```

## 发布

```sh
$ npm login

$ PACKAGE=boilerplate yarn build
# 或
$ yarn build

$ cd /packages/boilerplate

# First time for new package
$ npm publish --access public

# Publish
$ npm publish
```
