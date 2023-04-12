import { Module } from "@nestjs/common";
import { TFAController } from "./tfa.controller";
import { TFAService } from "./tfa.service";

@Module({
	controllers : [TFAController],
	providers : [TFAService],
})
export class TFAModule {}