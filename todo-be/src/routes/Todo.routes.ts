import TodoController from '@controllers/Todo.controller';
import { Routes } from '@interface/Routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { UserLoginValidator, TodoValidator } from '@utils/Validators';
import { Router } from 'express';

class TodoRoute implements Routes {
	public path = '/';
	public router = Router();
	public TodoController = new TodoController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			`${this.path}createtodo`,
			validationMiddleware(TodoValidator, 'body'),
			authMiddleware,
			this.TodoController.createTodo
		);
		this.router.get(
			`${this.path}list-all-todo`,
			authMiddleware,
			this.TodoController.findAllTodos
		);
		this.router.get(
			`${this.path}get-single-todo`,
			authMiddleware,
			this.TodoController.getSingleTodo
		);
		this.router.put(
			`${this.path}update-todo`,
			authMiddleware,
			this.TodoController.updateTodo
		);
		this.router.delete(
			`${this.path}delete-todo`,
			authMiddleware,
			this.TodoController.deleteTodo
		);
	}
}

export default TodoRoute;
