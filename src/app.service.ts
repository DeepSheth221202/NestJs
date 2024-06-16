import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { AppRepository } from './app.repository';

@Injectable()
export class AppService {

  constructor(public appRepo : AppRepository){}
  findAll(){
    return this.appRepo.findAll();
  }

  findOne(id: string){
    return this.appRepo.findOne(id);
  }

  create(content:string){
    return this.appRepo.create(content);
  }
}
