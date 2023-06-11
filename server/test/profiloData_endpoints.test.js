const request = require('supertest');
const mongoose = require('mongoose');
const Credenziali = require('../src/models/UserSchema');
const GestoreDB = require('../src/components/gestoreDB/gestoreDB');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
let server;

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

describe('API /api/v1/profiloData endpoints', () => {

    const user = {
        _id: new mongoose.Types.ObjectId(),
        username: 'test',
        email: 'test@example.com',
        password: 'Password123',
    };

    let token = 'Bearer ' + jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

    beforeEach(async () => {
        //await Credenziali.create(user);
    });

    afterEach(async () => {
        //await Credenziali.deleteMany({});
    });

    test('GET /api/v1/profiloData should respond with status 200 and user data', async () => {
        await Credenziali.create(user);

        const response = await request(app)
        .get('/api/v1/profiloData')
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.username).toBeDefined();
    });

    test('GET /api/v1/profiloData should respond with status 500 if an error occurs', async () => {
        const findOneMock = jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .get('/api/v1/profiloData')
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        findOneMock.mockRestore();
    });

    test('GET /api/v1/profiloData should respond with status 400 if no ID is provided', async () => {
        const response = await request(app)
        .get('/api/v1/profiloData')
        .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('PUT /api/v1/profiloData/password should update the password and respond with status 200', async () => {
        const newPassword = 'Newpassword123';

        const response = await request(app)
        .put('/api/v1/profiloData/password')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ nuovaPassword: newPassword });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Password aggiornata' });
    });

    test('PUT /api/v1/profiloData/password should return an error when an invalid password is provided', async () => {
        // Non fornire una password valida per simulare l'errore
        const invalidPassword = 'invalid-password';
        const newPassword = 'Newpassword123';

        const response = await request(app)
        .put('/api/v1/profiloData/password')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: invalidPassword, nuovaPassword: newPassword });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, message: 'Errore, password errata' });
    });
});