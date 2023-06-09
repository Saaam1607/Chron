const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const Credenziali = require('../src/models/UserSchema');

let server;
let api_url = '/api/v1/profilo';

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

    test('POST /api/v1/profilo/autenticazione should respond with status 200 and a token if authentication is successful', async () => {
        const user = {
            _id: new mongoose.Types.ObjectId(),
            email: 'test@example.com',
            password: 'password',
        };

        await Credenziali.create(user);

        const response = await request(app)
        .post(`${api_url}/autenticazione`)
        .send(user);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
    });



});

