import TodoRoute from '@routes/Todo.routes';
import App from './index';
import AuthRoute from '@routes/Auth.routes';

const app = new App([new AuthRoute(), new TodoRoute()]);

app.listen();
