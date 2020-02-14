import { PROJECT_ROOT_PATH } from '@src/app';
import * as graphqlHTTP from 'express-graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { graphqlErrorHandler } from '../config/GraphqlErrorHandler';
import { IBootstrapInitializer } from './bootstrap.init';
import { graphqlAuthChecker } from '../config/GraphQLAuthorizationChecker';

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
                container: Container,
                authChecker: graphqlAuthChecker
              }),
              // rootValue: root,
              graphiql: true, // http://localhost:8731/graphql,
              customFormatErrorFn: graphqlErrorHandler
          })
        );
    }

}