import { Module } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
	imports: [],
	controllers: [],
	providers: [GameGateway, GameService],
})
export class GameModule {}