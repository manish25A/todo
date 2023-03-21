import mongoose, { model, Schema, Document } from 'mongoose';
import { TodoInterface } from '@interface/Todo.interface';

const todoSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	type: {
		type: String,
		required: true,
	},
	successRate: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
});

const todoModel = model<TodoInterface & Document>('Todo', todoSchema);

export default todoModel;
