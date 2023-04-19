import { StatusGateway } from "./status.gateway";
import { StatusService } from "./status.service";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
	controllers: [],
	providers: [StatusGateway, StatusService],
})
export class StatusModule {}