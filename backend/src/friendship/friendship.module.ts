import { FriendshipController } from './friendship.controller';
import { Friendship } from 'src/entity/friendship.entity';
import { FriendshipService } from './friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship])],
  providers: [FriendshipService],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
