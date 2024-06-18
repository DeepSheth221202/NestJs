import { Injectable , NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    create(email:string, password:string){
        //by using this approach hooks will executed like AfterInsert (all hooks mentioned in entity file)
        const user = this.userRepository.create({email,password}); 
        return this.userRepository.save(user);

        //by using this approach hooks will not executed like AfterInsert
        //return this,this.userRepository.save({email,password});
    }

    find(email:string){
        return this.userRepository.find({
            where:{
                email:email
            }
        });
    }

    findOne(id:number){
        if(!id){
            return null; //if we dont check for this condition then repo.findOne(null) will return the first element from table
        }
        return this.userRepository.findOne({
            where:{id:id}
        });
    }

    async update(id:number , attrs : Partial<User>){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User Not Found!');
        }
        Object.assign(user, attrs);
        return this.userRepository.save(user);
    }

    async remove(id:number){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User Not Found!');
        }
        return this.userRepository.remove(user);
    }
}
