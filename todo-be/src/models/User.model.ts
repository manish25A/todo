import { model, Schema, Document } from 'mongoose';
import { UserInterface } from '@interface/User.interface';

const userSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
});

const userModel = model<UserInterface & Document>('User', userSchema);

export default userModel;
