import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { TFAModule } from './tfa/tfa.module';
import { TFAController } from './tfa/tfa.controller';
import { TFAService } from './tfa/tfa.service';

@Module({
  imports: [AuthModule, UserModule, TFAModule],
  controllers: [AppController, UserController, TFAController],
  providers: [AppService, AuthService, UserService, TFAService],
})
export class AppModule {}
