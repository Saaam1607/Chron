const request = require('supertest');
const mongoose = require('mongoose');
const TaskModel = require('../src/models/Task');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
let server;
let api_url = '/api/v1/todos';

beforeAll(async () => {
  jest.setTimeout(8000);
  await mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');

  server = app.listen(process.env.PORT || 8080);
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

test('app module should be defined', () => {
  expect(app).toBeDefined();
});

describe('API endpoints', () => {
    let token;

    beforeAll(() => {
        token =
        'Bearer ' +
        jwt.sign({ id: '64765870316275628c4870b9' }, process.env.ACCESS_TOKEN_SECRET);
    });

    afterEach(async () => {
        await TaskModel.deleteMany({});
    });

    test('GET /api/v1/todos should respond with status 200 and an array of tasks if tasks exist', async () => {
        await TaskModel.create({ nome: 'Test task', ID_utente: '64765870316275628c4870b9' });

        const response = await request(app)
        .get(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    test('GET /api/v1/todos should respond with status 204 if no tasks exist', async () => {
        const response = await request(app)
        .get(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(204);
    });

    test('GET /api/v1/todos should respond with status 500 if an error occurs', async () => {
        const getMock = jest.spyOn(TaskModel, 'find').mockImplementationOnce(() => {
        throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .get(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        getMock.mockRestore();
    });

    test('POST /api/v1/todos should respond with status 400 if nome is missing', async () => {
        const sendBody = {
            ID_utente: '64765870316275628c4870b9',
        };

        const response = await request(app)
        .post(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send(sendBody);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('POST /api/v1/todos should create a new task and respond with status 201', async () => {
        const sendBody = {
            nome: 'New task',
            ID_utente: '64765870316275628c4870b9',
        };

        const response = await request(app)
        .post(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send(sendBody);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.task).toBeDefined();
        expect(response.body.task.nome).toBe(sendBody.nome);
        expect(response.body.task.ID_utente).toBe(sendBody.ID_utente);
    });

    test('POST /api/v1/todos should respond with status 500 if an error occurs', async () => {
        const sendBody = {
            nome: 'New task',
            ID_utente: '64765870316275628c4870b9',
        };

        const createMock = jest.spyOn(TaskModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .post(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send(sendBody);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        createMock.mockRestore();
    });

    test('PUT /api/v1/todos/ should respond with status 400 if id is missing', async () => {
        const response = await request(app)
        .put(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('PUT /api/v1/todos/ should update an existing task and respond with status 200', async () => {
        let idTask = new mongoose.Types.ObjectId();

        const existingTask = await TaskModel.create({
            _id: idTask,
            nome: 'Test task',
            ID_utente: '64765870316275628c4870b9',
            contrassegna: false,
        });

        const response = await request(app)
        .put(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({id:existingTask._id});

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.contrassegna).toBe(!existingTask.contrassegna);
    });

    test('PUT /api/v1/todos should respond with status 404 if task is not found', async () => {

        const nonExistentTaskId = '12345678901234567890abcd';

        const response = await request(app)
        .put(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ id: nonExistentTaskId });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test('PUT /api/v1/todos/ should respond with status 500 if an error occurs', async () => {
        let idTask = new mongoose.Types.ObjectId();

        const existingTask = await TaskModel.create({
            _id: idTask,
            nome: 'Test task',
            ID_utente: '64765870316275628c4870b9',
            contrassegna: false,
        });

        const updateMock = jest.spyOn(TaskModel, 'updateOne').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .put(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ id: idTask });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        updateMock.mockRestore();
    });

    test('DELETE /api/v1/todos/ should respond with status 400 if id is missing', async () => {
        const response = await request(app)
        .delete(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('DELETE /api/v1/todos/ should delete an existing task and respond with status 200', async () => {
        let idTask = new mongoose.Types.ObjectId();

        const existingTask = await TaskModel.create({
            _id: idTask,
            nome: 'Test task',
            ID_utente: '64765870316275628c4870b9',
            contrassegna: true,
        });

        const response = await request(app)
        .delete(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ id: idTask });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('DELETE /api/v1/todos/ should respond with status 404 if task is not found', async () => {
        const nonExistentTaskId = '12345678901234567890abcd';

        const response = await request(app)
        .delete(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ id: nonExistentTaskId });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test('DELETE /api/v1/todos/ should respond with status 500 if an error occurs', async () => {
        let idTask = new mongoose.Types.ObjectId();

        const existingTask = await TaskModel.create({
            _id: idTask,
            nome: 'Test task',
            ID_utente: '64765870316275628c4870b9'
        });

        const deleteMock = jest.spyOn(TaskModel, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .delete(api_url)
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ id: idTask });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false)

        deleteMock.mockRestore();
    });

    test('GET /api/v1/todos//ordinata should respond with status 400 if name, group, date or missing', async () => {
        let tempTasks = [
            await TaskModel.create({ nome: 'Task 4323', ID_utente: '64765870316275628c4870b9' }),
            await TaskModel.create({ nome: 'Task 1234', ID_utente: '64765870316275628c4870b9' }),
            await TaskModel.create({ nome: 'Task 442', ID_utente: '64765870316275628c4870b9' }),
        ];

        const response = await request(app)
        .get('/api/v1/todos/ordinata/?sort=')
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('GET /api/v1/todos/ordinata should respond with status 200 and sorted tasks', async () => {
        // insert some tasks
        let tempTasks = [
            await TaskModel.create({ nome: 'Task 4323', ID_utente: '64765870316275628c4870b9' }),
            await TaskModel.create({ nome: 'Task 1234', ID_utente: '64765870316275628c4870b9' }),
            await TaskModel.create({ nome: 'Task 442', ID_utente: '64765870316275628c4870b9' }),
        ];
        
        tempTasks.sort((a, b) => a.nome.localeCompare(b.nome));

        // name
        const response = await request(app).get('/api/v1/todos/ordinata/?sort=name')
        .set('Accept', 'application/json')
        .set('Authorization', token)
      
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.tasks.map(task => task.nome)).toEqual(tempTasks.map(task => task.nome));

        // group
        const response2 = await request(app).get('/api/v1/todos/ordinata/?sort=group')
        .set('Accept', 'application/json')
        .set('Authorization', token)
        
        expect(response2.status).toBe(200);

        // data
        const response3 = await request(app).get('/api/v1/todos/ordinata/?sort=date')
        .set('Accept', 'application/json')
        .set('Authorization', token)

        expect(response3.status).toBe(200);

    });
      
    test('GET /ordinata should respond with status 204 if no tasks exist', async () => {
        const response = await request(app).get('/api/v1/todos/ordinata?sort=name')
        .set('Accept', 'application/json')
        .set('Authorization', token)
      
        expect(response.status).toBe(204);
    });

    test('GET /api/v1/todos/ordinata should respond with status 500 if an error occurs', async () => {
        const findMock = jest.spyOn(TaskModel, 'find').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app).get('/api/v1/todos/ordinata?sort=name')
        .set('Accept', 'application/json')
        .set('Authorization', token)
      
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        findMock.mockRestore();
    }
    );
});