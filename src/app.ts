require('module-alias/register')

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import "reflect-metadata";
import { ContainerExt } from '@ext/typedi.ext';
import { BootstrapAppCreator } from '@boot/initializer/BootstrapAppCreator';
import { DatabaseBootstrapInitializer } from '@boot/initializer/DatabaseBootstrapInitializer';
import { DIContainerBootstrapInitializer } from '@boot/initializer/DIContainerBootstrapInitializer';
import { GraphqlBootStrapInitializer } from '@boot/initializer/GraphqlBootStrapInitializer';
import { RoutingControllerBootstrapInitializer } from '@boot/initializer/RoutingControllerBootstrapInitializer';
import router from '@ctrl/routes/index';
import { readFinallyAppConfig } from '@util/appUtil';

export const PROJECT_ROOT_PATH = __dirname
let bootstrap = async () => {

  let finallyAppConfig = readFinallyAppConfig()
  console.log("Finally App Config: \n", finallyAppConfig)

  // ######### 连接 Database #########
  await new DatabaseBootstrapInitializer().initialize(null)

  // ######### 创建 app #########
  let app = new BootstrapAppCreator().create()

  // ######### 初始化 Routing-Controller #########
  new RoutingControllerBootstrapInitializer().initialize(app)

  // https://github.com/typestack/typedi/issues/73#issuecomment-403964309
  new DIContainerBootstrapInitializer().initialize(app)

  // ######### 初始化 Graphql #########
  await new GraphqlBootStrapInitializer().initialize(app)

  // ######### 初始化 view engine #########
  app.set('views', path.join(PROJECT_ROOT_PATH, 'views'));
  app.set('view engine', 'pug');

  // ######### 初始化 Cookie #########
  app.use(cookieParser());

  // ######### 中间件：拦截器 #########
  app.use((req, res, next) => {
    console.log("[intercept]req: ", req.url)
    console.log("[intercept]req.cookies: ", req.cookies)
    next()
  })

  // ######### 初始化日志 #########
  // create a write stream (in append mode)
  // var accessLogStream = fs.createWriteStream(path.join(projectRootPath, 'logs', 'access.log'), { flags: 'a' })
  // app.use(morgan('combined', { stream: accessLogStream }))
  app.use(morgan('combined'))

  // ######### Static 页面 #########
  app.use('/web', express.static(path.join(PROJECT_ROOT_PATH, 'public')));

  // ######### 初始化 body 解析 #########
  app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
  app.use(bodyParser.json()) // parse application/json


  // ######### 初始化 Upload #########
  // import * as fileupload from 'express-fileupload';
  // app.use(fileupload({
  //     limits: { fileSize: 50 * 1024 * 1024 },
  //     useTempFiles : true,
  //     tempFileDir : `${projectRootPath}/files/tmp/`
  // }))

  // ######### 初始化路由 #########
  app.use(router)

  // ######### 初始化全局异常捕获，避免 crash #########
  process.on('unhandledRejection', rej => {
    console.warn('[ERROR]unhandledRejection, rej: ', rej)
    // throw rej
  });

  const port = finallyAppConfig.server.port || 8731
  app.listen(port, () => {
    return console.log(`server is listening on ${port}`)
  })

  // 检查是否存在依赖没有注入成功
  ContainerExt.finally()

}

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)

bootstrap()
