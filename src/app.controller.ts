import { Controller, Get , Post, Body, Param , NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('/messages')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  listMessages(){
    return this.appService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto){
    return this.appService.create(body.content);
  }

  @Get('/:id')
  async getMessage(@Param('id') id : string){
    const message = await this.appService.findOne(id);
    if(!message){
      throw new NotFoundException('message not found!');
    }
    return message;
  }
}
