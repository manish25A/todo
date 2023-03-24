import { TodoRequest, UserRequest } from '@interface/Auth.interface';
import { TodoInterface } from '@interface/Todo.interface';
import TodoService from '@services/Todo.service';
import { TodoValidator } from '@utils/Validators';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';

class AuthController {
	public todoService = new TodoService();

	public createTodo = async (
		req: UserRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { _id } = req.user;
			const reqTodoData = {
				...req.body,
				userId: _id,
			};
			const todoData: TodoValidator = await reqTodoData;
			const todoSavedData: TodoInterface = await this.todoService.createTodo({
				...todoData,
			});
			res.status(201).json({ data: todoSavedData, message: 'save todo' });
		} catch (error) {
			next(error);
		}
	};

	public findAllTodos = async (
		req: UserRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { _id } = req.user;
			const allTodos = await this.todoService.listTodo(_id);

			res.status(200).json({ data: allTodos, message: 'alltodos' });
		} catch (error) {
			next(error);
		}
	};
	public getSingleTodo = async (
		req: TodoRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { _id } = req.user;
			const params = req.query;
			const allTodos = await this.todoService.getTodo(params._id, _id);
			res.status(200).json({ data: allTodos, message: 'onetodo' });
		} catch (error) {
			next(error);
		}
	};
	public updateTodo = async (
		req: TodoRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { _id } = req.body;
			const updateTodo = await this.todoService.updateTodo(req.body, _id);
			res.status(200).json({ data: updateTodo, message: 'todo updated' });
		} catch (error) {
			next(error);
		}
	};

	public deleteTodo = async (
		req: TodoRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { _id } = req.query;
			const deleteTodo = await this.todoService.deleteTodo(_id);
			res.status(200).json({ data: deleteTodo, message: 'todo deleted' });
		} catch (error) {
			next(error);
		}
	};
	public getCompletionRate = async (
		req: TodoRequest,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { _id } = req.user;
			const completedTodo = await this.todoService.getCompletionRate(_id);
			res.status(200).json({ data: completedTodo, message: 'completion rate' });
		} catch (error) {
			next(error);
		}
	};
}

export default AuthController;
