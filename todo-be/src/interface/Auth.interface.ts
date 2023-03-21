import { Request } from 'express';
import { UserInterface } from '@interface/User.interface';

export interface TokenData {
	token: string;
}
export interface DataStoredInToken {
	_id: string;
}
export interface UserRequest extends Request {
	user: UserInterface;
}

export interface TodoRequest extends Request {
	_id: string;
	user: UserInterface;
}
