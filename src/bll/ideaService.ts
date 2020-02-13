import { Idea } from '../dal/db/entity/idea';
import { getCustomRepository } from 'typeorm';
import { IdeaRepository } from '../dal/db/repository/ideaRepository';
import { Lazy } from '../util/usage';

let repository = new Lazy<IdeaRepository>(()=> getCustomRepository(IdeaRepository))

export let queryIdeas = async ()=>{
    let result = await repository.get().findAndCount()
    console.log("result: ", result)
    repository.get().find({})
}

export let addIdea = async (idea: Idea)=>{
    await repository.get().insert(idea)
}