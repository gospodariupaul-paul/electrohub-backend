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

  // 🔥 Când cineva inițiază un apel
  @SubscribeMessage('call-offer')
  handleOffer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.conversationId.toString()).emit('call-offer', data);
  }

  // 🔥 Când cineva acceptă apelul
  @SubscribeMessage('call-answer')
  handleAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.conversationId.toString()).emit('call-answer', data);
  }

  // 🔥 Când se trimit ICE candidates
  @SubscribeMessage('ice-candidate')
  handleCandidate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.conversationId.toString()).emit('ice-candidate', data);
  }

  // 🔥 Când cineva închide apelul
  @SubscribeMessage('call-end')
  handleEnd(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.conversationId.toString()).emit('call-end', data);
  }

  // 🔥 Când un user intră în cameră (conversație)
  @SubscribeMessage('join-call-room')
  handleJoinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.conversationId.toString());
  }
}
