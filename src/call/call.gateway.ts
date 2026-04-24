import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CallGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('call-offer')
  handleOffer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.conversationId.toString()).emit('call-offer', data);
  }

  @SubscribeMessage('call-answer')
  handleAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.conversationId.toString()).emit('call-answer', data);
  }

  @SubscribeMessage('ice-candidate')
  handleCandidate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.conversationId.toString()).emit('ice-candidate', data);
  }

  @SubscribeMessage('call-end')
  handleEnd(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.conversationId.toString()).emit('call-end', data);
  }

  @SubscribeMessage('join-call-room')
  handleJoinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.conversationId.toString());
  }
}
