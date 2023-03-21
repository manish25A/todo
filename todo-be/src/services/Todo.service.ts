import { TodoInterface } from '@interface/Todo.interface';
import todoModel from '@models/Todo.model';
import { TodoValidator } from '@utils/Validators';
import { HttpError } from '../utils/HTTPError';
import { isEmpty } from '../utils/utils';
class TodoService {
	private todo = todoModel;
	constructor() {}

	public async createTodo(todoData: TodoValidator): Promise<TodoInterface> {
		if (isEmpty(todoData)) throw new HttpError(400, 'todoData is empty');
		const createTodo: TodoInterface = await this.todo.create({
			...todoData,
		});

		return createTodo;
	}
	public async listTodo(id): Promise<TodoInterface> {
		const listTodo: any = await this.todo.find({ userId: id });
		return listTodo;
	}
	public async getTodo(id, userId): Promise<TodoInterface> {
		const singleTodo: any = await this.todo.findOne({ _id: id, userId });
		return singleTodo;
	}
	public async updateTodo(updateData, id): Promise<TodoInterface> {
		const todo: any = await this.todo.findOne({ _id: id });
		if (isEmpty(todo)) throw new HttpError(400, 'Todo not found');
		const updateTodo = await this.todo.findByIdAndUpdate(
			{ _id: id },
			{
				...updateData,
			},
			{
				new: true,
			}
		);
		console.log('updatetodo', updateTodo);
		return updateTodo;
	}
	public async deleteTodo(id): Promise<TodoInterface> {
		const todo: any = await this.todo.findOne({ _id: id });
		if (isEmpty(todo)) throw new HttpError(400, 'Todo not found');
		const deleteTodo = await this.todo.findByIdAndDelete({ _id: id });

		return deleteTodo;
	}
}
export default TodoService;
