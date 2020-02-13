import { ContainerExt } from './../ext/typedi.ext';
import Container from 'typedi';
import { ConnectionOptions, createConnection, useContainer, EntityManager, getManager } from 'typeorm';
import { IBootstrapInitializer } from './bootstrap.init';
import { readFinallyAppConfig } from '../util/appUtil';

const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

export class DatabaseBootstrapInitializer implements IBootstrapInitializer {
    async initialize(app: any) {
        useContainer(Container)

        console.log("[typeorm]createConnection START >>>>>>>>")

        let appFinallyConfig = readFinallyAppConfig()
        let connectionOptions: ConnectionOptions = {
            ...appFinallyConfig.mysql,
            entities: [
                "src/dal/db/entity/**/*.ts"
            ],
            migrations: [
                "src/dal/db/migration/**/*.ts"
            ],
            subscribers: [
                "src/dal/db/subscriber/**/*.ts"
            ],
            cli: {
                entitiesDir: "src/dal/db/entity",
                migrationsDir: "src/dal/db/migration",
                subscribersDir: "src/dal/db/subscriber"
            },
            namingStrategy: new SnakeNamingStrategy()
        }

        await createConnection(connectionOptions)
            .then(connection => {
                // here you can start to work with your entities
                console.log("[typeorm]createConnection SUCCESS")
                ContainerExt.set(EntityManager, getManager())
            })
            .catch(error => console.log("[typeorm]createConnection FAIL: ", error));

    }

}