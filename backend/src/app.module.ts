import { FriendshipController } from './friendship/friendship.controller';
import { FriendshipService } from './friendship/friendship.service';
import { Friendship } from './entity/friendship.entity';
import { UserController } from './user/user.controller';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthController } from './auth/auth.controller';
import { TFAController } from './tfa/tfa.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TFAService } from './tfa/tfa.service';
import { User } from './entity/user.entity';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Friendship])],
  controllers: [AppController, AuthController, UserController, TFAController, FriendshipController],
  providers: [AppService, AuthService, UserService, TFAService, FriendshipService],
})
export class AppModule {}
