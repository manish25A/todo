import { TodoInterface } from '@interface/Todo.interface';
import todoModel from '@models/Todo.model';
import { TodoValidator } from '@utils/Validators';
import { HttpError } from '../utils/HTTPError';
import { isEmpty } from '../utils/utils';
class TodoService {
	private todo = todoModel;
	constructor() {}

	public async createTodo(todoData: TodoInterface): Promise<TodoInterface> {
		if (isEmpty(todoData)) throw new HttpError(400, 'todoData is empty');
		todoData.creationDate = new Date();
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

	public async getCompletionRate(userId): Promise<any> {
		// const pipeline: any[] = [
		// 	{
		// 		$facet: {
		// 			countByUser: [
		// 				{
		// 					$match: {
		// 						userId: userId,
		// 					},
		// 				},
		// 				{
		// 					$group: {
		// 						_id: '$userId',
		// 						count: {
		// 							$sum: 1,
		// 						},
		// 					},
		// 				},
		// 				{
		// 					$sort: {
		// 						_id: 1,
		// 					} as Record<string, any>,
		// 				},
		// 			],
		// 			countByUserIdAndStatus: [
		// 				{
		// 					$match: {
		// 						userId: userId,
		// 						status: 'completed',
		// 					},
		// 				},
		// 				{
		// 					$group: {
		// 						_id: { userId: '$userId', status: '$status' },
		// 						count: {
		// 							$sum: 1,
		// 						},
		// 						percentage: {
		// 							$multiply: [{ $divide: ['$count', '$countByUser.count'] }, 100],
		// 						},
		// 					},
		// 				},
		// 				{
		// 					$sort: {
		// 						_id: 1,
		// 					} as Record<string, any>,
		// 				},
		// 			],
		// 		},
		// 	},
		// ];

		const pipeline: any[] = [
			{
				$facet: {
					countByUser: [
						{
							$match: {
								userId: userId,
							},
						},
						{
							$group: {
								_id: {
									user: '$userId',
								},
								count: {
									$sum: 1,
								},
							},
						},
						{
							$sort: {
								_id: 1,
							} as Record<string, any>,
						},
					],
					countByUserIdAndStatus: [
						{
							$match: {
								userId: userId,
							},
						},
						{
							$group: {
								_id: {
									userId: '$userId',
									status: '$status',
									creationDate: {
										$dateToString: {
											date: '$creationDate',
											format: '%Y-%m-%d',
										},
									},
								},
								count: {
									$sum: 1,
								},
							},
						},
						{
							$sort: {
								_id: 1,
							} as Record<string, any>,
						},
					],
					totalCompletedData: [
						{
							$match: {
								userId: userId,
								status: 'completed',
							},
						},
						{
							$group: {
								_id: {
									userId: '$userId',
									status: '$status',
									creationDate: {
										$dateToString: {
											date: '$creationDate',
											format: '%Y-%m-%d',
										},
									},
								},
								count: {
									$sum: 1,
								},
							},
						},
						{
							$sort: {
								_id: 1,
							} as Record<string, any>,
						},
					],
				},
			},
			{
				$project: {
					percentages: {
						$map: {
							input: '$totalCompletedData',
							as: 'completed',
							in: {
								$let: {
									vars: {
										total: {
											$arrayElemAt: [
												'$countByUser.count',
												{
													$indexOfArray: [
														'$countByUser._id',
														'$$completed._id',
													],
												},
											],
										},
									},
									in: {
										_id: '$$completed._id',
										count: '$$completed.count',
										completionRate:
											'$total' === undefined
												? undefined
												: {
														$multiply: [
															{ $divide: ['$$completed.count', '$$total'] },
															100,
														],
												  },
									},
								},
							},
						},
					},
					totalCount: '$countByUser',
				},
			},
		];
		// Execute aggregation pipeline
		const completionRate: any = await this.todo.aggregate(pipeline).exec();
		console.log(completionRate);

		return completionRate;
	}
}
export default TodoService;
