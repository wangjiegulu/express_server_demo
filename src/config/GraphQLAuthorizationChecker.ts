import AuthService from '@bll/AuthService';
import { AuthStatus } from '@dal/db/entity/account';
import { AuthChecker } from "type-graphql";
import Container from 'typedi';

export const graphqlAuthChecker: AuthChecker<{}, AuthStatus> = async (
  { root, args, context, info },
  roles,
) => {

  // console.log("root: ", root)
  // console.log("args: ", args)
  // console.log("context: ", context)
  // console.log("info: ", info)
  console.log("roles: ", roles)

  let token = context['headers']["x-authorization-token"];
  return await Container.get(AuthService).checkAuth(token, roles)
};