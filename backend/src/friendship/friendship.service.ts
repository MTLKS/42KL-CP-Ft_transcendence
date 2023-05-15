import { Friendship } from 'src/entity/friendship.entity';
import { Channel } from 'src/entity/channel.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entity/member.entity';
import { User } from 'src/entity/users.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class FriendshipService {
	constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>, @InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Member) private memberRepository: Repository<Member>, @InjectRepository(Channel) private channelRepository: Repository<Channel>, private userService: UserService) {}

	// User connect to friendship socket
	async userConnect(client: any): Promise<any> {
		client.join((await this.userService.getMyUserData(client.handshake.headers.authorization)).intraName);
	}

	// User send friend request to friendship room
	async friendshipRoom(client: any, server: any, intraName: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(client.handshake.headers.authorization);
		if (intraName === undefined)
			return server.to(USER_DATA.intraName).emit('friendshipRoom', { "error": "Invalid body - body must include intraName(string)" });
		client.join(intraName);
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: intraName} });
		if (FRIENDSHIP === null)
			return server.to(USER_DATA.intraName).emit('friendshipRoom', { "error": "Invalid intraName - friendship does not exist" });
		server.to(intraName).emit('friendshipRoom', { "intraName": USER_DATA.intraName, "status": FRIENDSHIP.status });
	}

	// Check if the JSON body is valid
	async checkJson(senderIntraName: string, receiverIntraName: string, status:string): Promise<any> {
		if (receiverIntraName == undefined || status == undefined)
			return { error: "Invalid body - body must include receiverIntraName(string) and status(stirng)" }
		if (senderIntraName == receiverIntraName)
			return { error: "Invalid intraName - no friends so you friend yourself?" }
		if (status.toUpperCase() != "PENDING" && status.toUpperCase() != "ACCEPTED" && status.toUpperCase() != "BLOCKED")
			return { error: "Invalid status - status must be PENDING, ACCEPTED or BLOCKED"}
	}

	// Get all friendship by accessToken
	async getFriendship(accessToken: string): Promise<any> {
		return await this.getFriendshipByIntraNAme((await this.userService.getMyUserData(accessToken)).intraName);
	}

	// Gets all friendship by intraName
	async getFriendshipByIntraNAme(intraName: string): Promise<any> {
		const RECEIVER = await this.friendshipRepository.find({ where: {receiverIntraName: intraName} });
		for (let receiver of RECEIVER) {
			const USER = await this.userRepository.findOne({ where: {intraName: receiver.senderIntraName} });
			if (USER === null)
				continue;
			receiver['userName'] = USER.userName;
			receiver['elo'] = USER.elo;
			receiver['avatar'] = USER.avatar;
		}
		const SENDER = await this.friendshipRepository.find({ where: {senderIntraName: intraName} });
		for (let sender of SENDER) {
			const USER = await this.userRepository.findOne({ where: {intraName: sender.receiverIntraName} });
			if (USER === null)
				continue;
			sender['userName'] = USER.userName;
			sender['elo'] = USER.elo;
			sender['avatar'] = USER.avatar;
		}
		return [...RECEIVER, ...SENDER];
	}

	// Creates a new friendship
	async newFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;
		if (status.toUpperCase() == "ACCEPTED")
			return { error: "Invalid status - friendship status (ACCEPTED) is not supported" }
		if ((await this.friendshipRepository.findOne({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName} })) !== null || (await this.friendshipRepository.findOne({ where: {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName} })) !== null)
			return { error: "Invalid receiverIntraName - friendship already exist" }
		const RECEIVER = await this.userRepository.findOne({ where: {intraName: receiverIntraName} });
		if (RECEIVER === null)
			return { error: "Invalid receiverIntraName - user does not exist" };
		const NEW_FRIENDSHIP = new Friendship(USER_DATA.intraName, receiverIntraName, status.toUpperCase());
		await this.friendshipRepository.save(NEW_FRIENDSHIP);
		return NEW_FRIENDSHIP;
	}

	// Updates a friendship
	async updateFriendship(accessToken: string, receiverIntraName: string, status: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, status);
		if (ERROR)
			return ERROR;
		const RECEIVER = await this.friendshipRepository.findOne({ where: {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName} });
		if (status.toUpperCase() == "ACCEPTED") {
			if (RECEIVER === null)
				return { error: "Invalid receiverIntraName - Friendship does not exist" }
			RECEIVER.status = status.toUpperCase();
			const MY_CHANNEL = await this.channelRepository.findOne({ where: {owner: {intraName: USER_DATA.intraName}} });
			const MY_MEMBER = await this.memberRepository.findOne({ where: { user: {intraName: USER_DATA.intraName}, channelId: MY_CHANNEL.channelId}})
			const FRIEND_DATA = await this.userService.getUserDataByIntraName(accessToken, receiverIntraName);
			if (FRIEND_DATA.error !== undefined)
				return FRIEND_DATA;
			const FRIEND_CHANNEL = await this.channelRepository.findOne({ where: {owner: {intraName: receiverIntraName}} });
			const FRIEND_MEMBER = await this.memberRepository.findOne({ where: { user: {intraName: FRIEND_DATA.intraName}, channelId: FRIEND_CHANNEL.channelId}})
			if (MY_MEMBER === null)
				await this.memberRepository.save(new Member(USER_DATA, FRIEND_CHANNEL.channelId, true, false, false, new Date().toISOString()));
			if (FRIEND_MEMBER === null)
				await this.memberRepository.save(new Member(FRIEND_DATA, MY_CHANNEL.channelId, true, false, false, new Date().toISOString()));
			return await this.friendshipRepository.save(RECEIVER);
		}
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: {senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName} });
		if (status.toUpperCase() == "BLOCKED")
		{
			if (FRIENDSHIP === null && RECEIVER === null)
				return { error: "Invalid receiverIntraName - Friendship does not exist" }
			if (FRIENDSHIP === null) {
				FRIENDSHIP.status = status.toUpperCase();
				await this.friendshipRepository.save(FRIENDSHIP);
				return FRIENDSHIP;
			} else {
				const NEW_FRIENDSHIP = new Friendship(USER_DATA.intraName, receiverIntraName, status.toUpperCase());
				await this.friendshipRepository.delete(FRIENDSHIP);
				await this.friendshipRepository.save(NEW_FRIENDSHIP);
				return NEW_FRIENDSHIP;
			}
		}
		return { error: "Friendship status (PENDING) is not supported - use POST method to create a new PENDING friendship instead" }
	}

	// Deletes a friendship
	async	deleteFriendship(accessToken: string, receiverIntraName: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, "ACCEPTED");
		if (ERROR)
			return ERROR;
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName}, {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName}] });
		if (FRIENDSHIP === null)
			return { error: "Invalid receiverIntraName - friendship does not exist" }
		if (FRIENDSHIP.senderIntraName === USER_DATA.intraName || (FRIENDSHIP.receiverIntraName === USER_DATA.intraName && FRIENDSHIP.status.toUpperCase() !== "BLOCKED"))
			await this.friendshipRepository.delete(FRIENDSHIP);
		return FRIENDSHIP;
	}

	// Returns current friendship with a user
	async getFriendshipStatus(accessToken: string, receiverIntraName: string): Promise<any> {
		const USER_DATA = await this.userService.getMyUserData(accessToken);
		const ERROR = await this.checkJson(USER_DATA.intraName, receiverIntraName, "ACCEPTED");
		if (ERROR)
			return ERROR;
		const FRIENDSHIP = await this.friendshipRepository.findOne({ where: [{senderIntraName: USER_DATA.intraName, receiverIntraName: receiverIntraName}, {senderIntraName: receiverIntraName, receiverIntraName: USER_DATA.intraName}] });
		if (FRIENDSHIP === null)
			return { error: "Friendship does not exist - use POST method to create" }
		return FRIENDSHIP;
	}
}
