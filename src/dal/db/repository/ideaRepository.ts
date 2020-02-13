import { 
    EntityRepository, Repository, getRepository 
} from "typeorm";

import { Idea } from "../entity/idea";

@EntityRepository(Idea)
export class IdeaRepository extends Repository<Idea> {
    
}