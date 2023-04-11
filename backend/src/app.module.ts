import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { User } from './entity/user.entity';
import { AuthController } from './auth/auth.controller';
import { TFAController } from './tfa/tfa.controller';
import { TFAService } from './tfa/tfa.service';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TypeOrmModule.forFeature([User])],
  controllers: [AppController, AuthController, UserController, TFAController],
  providers: [AppService, AuthService, UserService, TFAService],
})
export class AppModule {}
