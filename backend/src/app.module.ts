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
import { FriendshipModule } from './friendship/friendship.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([User]), FriendshipModule],
  controllers: [AppController, AuthController, UserController, TFAController],
  providers: [AppService, AuthService, UserService, TFAService],
})
export class AppModule {}
