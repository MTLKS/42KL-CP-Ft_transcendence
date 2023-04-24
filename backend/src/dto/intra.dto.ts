export class IntraDTO {
	constructor(dto: IntraDTO) {
		Object.assign(this, dto);
	}
	id: number;
	url: string;
	name : string;
	email: string;
	imageMedium: string;
	imageLarge: string;
	blackhole: string;

}