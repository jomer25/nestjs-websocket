import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  private messages: Message[] = [
    {
      name: "Jomer", 
      text: "Hi Joanna!",
    },
    {
      name: "Joanna",
      text: "Hello :)"
    }
  ];
  
  private clientToUser = {};
  
  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
    };
    this.messages.push(message)
    
    return message;
  }

  findAll() {
    return this.messages;
  }

  joinRoom(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  typing(clientId: string) {
    return this.clientToUser[clientId];
  }
}
