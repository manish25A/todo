import { IsEmail, IsString } from 'class-validator';

export class UserValidator {
	@IsString()
	public name: string;
	@IsEmail()
	public email: string;
	@IsString()
	public password: string;
}

export class UserLoginValidator {
	@IsEmail()
	public email: string;

	@IsString()
	public password: string;
}

export class TodoValidator {
	@IsString()
	name: string;
	@IsString()
	type: string;
	@IsString()
	successRate: string;
}
