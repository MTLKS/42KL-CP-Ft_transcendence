import { FriendshipController } from './friendship/friendship.controller';
import { FriendshipService } from './friendship/friendship.service';
import { TYPEORM_CONFIG } from './config/typeorm.config';
import { MULTER_CONFIG } from 'src/config/multer.config';
import { Friendship } from './entity/friendship.entity';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StatusService } from './status/status.service';
import { StatusGateway } from './status/status.gateway';
import { TFAController } from './tfa/tfa.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entity/status.entity';
import { ChatModule } from './chat/chat.module';
import { TFAService } from './tfa/tfa.service';
import { User } from './entity/user.entity';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONFIG), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Friendship]), TypeOrmModule.forFeature([Status]), MulterModule.register(MULTER_CONFIG), ChatModule],
  controllers: [AppController, AuthController, UserController, TFAController, FriendshipController],
  providers: [AppService, AuthService, UserService, TFAService, FriendshipService, StatusGateway, StatusService],
})
export class AppModule {}
