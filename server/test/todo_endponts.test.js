const request = require('supertest');
const mongoose = require('mongoose');
const TaskModel = require('../src/models/Task');
const jwt = require('jsonwebtoken');
const app = require('../src/server'); 
let server;

beforeAll( async () => { 
    jest.setTimeout(8000);
    await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB")
        server = app.listen(process.env.PORT || 8080);
    })
    .catch((err) => console.log(err))
});

afterAll( () => { 
    mongoose.connection.close(true); 
    server.close();
});
    


test('app module should be defined', () => {
    expect(app).toBeDefined();
});
    


describe('SUIT API GET /api/v1/todos', () => {

    let token = 'Bearer ' + jwt.sign({ id: "64765870316275628c4870b9" }, process.env.ACCESS_TOKEN_SECRET)

    test('should respond with status 200 and an array of tasks if tasks exist', async () => {
        const response = await request(app).get('/api/v1/todos').set('Authorization', token).set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    test('should respond with status 204 if no tasks exist', async () => {
        // rimozione di tutti i task dal database
        await TaskModel.deleteMany({});

        const response = await request(app).get('/api/v1/todos').set('Authorization', token).set('Accept', 'application/json');

        expect(response.status).toBe(204);
    });

    test('should respond with status 500 if an error occurs', async () => {
        // Simula un errore nel server
        const getMock = jest.spyOn(app, 'get');
        getMock.mockImplementationOnce(() => {
            throw new Error("Simulated server error");
        });

        const response = await request(app).get('/api/v1/todos').set('Authorization', token).set('Accept', 'application/json');


        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        getMock.mockRestore();

    });

});