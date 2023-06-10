const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const Credenziali = require('../src/models/UserSchema');

let server;
let api_url = '/api/v1/profilo';

beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.MONGODB_URI, {
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

describe('API /api/v1/profilo endpoints', () => {
    let token;

    beforeAll(() => {
        token =
        'Bearer ' +
        jwt.sign({ id: '64765870316275628c4870b9' }, process.env.ACCESS_TOKEN_SECRET);
    });

    afterEach(async () => {
        //await Credenziali.deleteMany({});
    });

    const user = {
        _id: new mongoose.Types.ObjectId(),
        username: 'test',
        email: 'test@example.com',
        password: 'Password123',
    };

    test('POST /api/v1/profilo/autenticazione should respond with status 200 and a token if authentication is successful', async () => {

        await Credenziali.create(user);

        const response = await request(app)
        .post(`${api_url}/autenticazione`)
        .send(user);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
    });


    test('POST /api/v1/profilo/autenticazione should respond with status 401 if authentication fails', async () => {

        const response = await request(app)
        .post(`${api_url}/autenticazione`)
        .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Autenticazione non riuscita, credenziali non corrispondenti o valide');
    });

    
    test('POST /api/v1/profilo/autenticazione should respond with status 500 if an error occurs', async () => {
        const loginMock = jest.spyOn(Credenziali, 'findOne').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .post(`${api_url}/autenticazione`)
        .send(user);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        loginMock.mockRestore();
    });

    test('POST /api/v1/profilo/nuova-autenticazione should respond with status 409 if email already exists', async () => {

        const response = await request(app)
        .post(`${api_url}/nuova-autenticazione`)
        .send(user);

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Errore, email già utilizzata');
    });

    test('POST /api/v1/profilo/nuova-autenticazione should respond with status 201 and a token if registration is successful', async () => {
        //deleting all users
        await Credenziali.deleteMany({});

        const response = await request(app)
        .post(`${api_url}/nuova-autenticazione`)
        .send({ email: user.email, password: user.password, username: user.username });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    /*
    test('POST /api/v1/profilo/nuova-autenticazione should respond with status 500 if an error occurs', async () => {
        const registerMock = jest.spyOn(Credenziali, 'create').mockImplementationOnce(() => {
        throw new Error('Errore generato dal mock');
        });

        const user = {
            email: 'test@example.com',
            password: 'password',
        }

        const response = await request(app)
        .post(`${api_url}/nuova-autenticazione`)
        .send(user);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        registerMock.mockRestore();
    });
    */


});

