import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class MessagesGateway {
  constructor(private messagesService: MessagesService) {}
  
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
    ) {
    const message = await this.messagesService.create(createMessageDto, client.id);
    
    this.server.emit("message", message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody("name") name: string,
    @ConnectedSocket() client: Socket,
  ) {
    return this.messagesService.joinRoom(name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody("isTyping") isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.messagesService.typing(client.id);
    
    client.broadcast.emit("typing", { name, isTyping });
  }
}
