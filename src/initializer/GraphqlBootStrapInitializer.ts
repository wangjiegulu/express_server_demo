import { PROJECT_ROOT_PATH } from './../app';
import * as graphqlHTTP from 'express-graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { graphqlErrorHandler } from '../config/GraphqlErrorHandler';
import { IBootstrapInitializer } from './bootstrap.init';

export class GraphqlBootStrapInitializer implements IBootstrapInitializer{
  useContainer
    async initialize(app: any) {
        app.use(
          "/graphql",
          graphqlHTTP({
              schema: await buildSchema({
                resolvers: [
                    `${PROJECT_ROOT_PATH}/**/resolver/*Resolver.{ts,js}`
                ],
                container: Container
              }),
              // rootValue: root,
              graphiql: true, // http://localhost:8731/graphql,
              customFormatErrorFn: graphqlErrorHandler
          })
        );
    }

}