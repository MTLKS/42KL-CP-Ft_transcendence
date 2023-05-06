import { FriendshipController } from './friendship/friendship.controller';
import { FriendshipService } from './friendship/friendship.service';
import { FriendshipGateway } from './friendship/friendship.gateway';
import { TYPEORM_CONFIG } from './config/typeorm.config';
import { MULTER_CONFIG } from 'src/config/multer.config';
import { Friendship } from './entity/friendship.entity';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StatusService } from './status/status.service';
import { StatusGateway } from './status/status.gateway';
import { ChatController } from './chat/chat.controller';
import { TFAController } from './tfa/tfa.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';
import { Message } from './entity/message.entity';
import { Channel } from './entity/channel.entity';
import { ChatGateway } from './chat/chat.gateway';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entity/status.entity';
import { Member } from './entity/member.entity';
import { TFAService } from './tfa/tfa.service';
import { User } from './entity/user.entity';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG), TypeOrmModule.forFeature([User, Friendship, Status, Channel, Member, Message]), MulterModule.register(MULTER_CONFIG)],
  controllers: [AppController, AuthController, UserController, TFAController, FriendshipController, ChatController],
  providers: [AppService, AuthService, UserService, TFAService, FriendshipGateway, FriendshipService, StatusGateway, StatusService, ChatGateway, ChatService, GameGateway, GameService],
})
export class AppModule {}
