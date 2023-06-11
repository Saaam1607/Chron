const request = require('supertest');
const mongoose = require('mongoose');
const SessioneModel = require('../src/models/Sessione');
const GestoreDB = require('../src/components/gestoreDB/gestoreDB');
const jwt = require('jsonwebtoken');

const app = require('../src/server');

let server;
let api_url = '/api/v1/sessione';


beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    //delte all collections
    //await mongoose.connection.db.dropDatabase();

    server = app.listen(process.env.PORT || 8080);
});


afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});


test('app module should be defined', () => {
    expect(app).toBeDefined();
});

describe('API /api/v1/sessione endpoints', () => {

    const sessione = {
        _id: '5f9b2c1b9d1e8c2a3c9b8b0a',
        idUtente: '5f9b2c1b9d1e8c2a3c9b8b0a',
        minuti: 30,
        date: '2020-11-01',
    };

    let token = 'Bearer ' + jwt.sign({ id: sessione.idUtente }, process.env.ACCESS_TOKEN_SECRET);

    beforeEach(async () => {
        await SessioneModel.deleteMany({});
        await SessioneModel.create(sessione);
    });

    afterEach(async () => {
        await SessioneModel.deleteMany({});
    });

    // PUT /api/v1/sessione

    test('PUT /api/v1/sessione should respond with status 401 if no token is provided', async () => {
        const response = await request(app)
            .put(api_url)
            .send({ minuti: 30, date: '2020-11-01' });
        expect(response.statusCode).toBe(401);
    });

    test('PUT /api/v1/sessione should respond with status 400 if no minuti is provided', async () => {
        const response = await request(app)
            .put(api_url)
            .set('Authorization', token)
            .send({ date: '2020-11-01' });
        expect(response.statusCode).toBe(400);
    });

    test('PUT /api/v1/sessione should respond with status 400 if no data is provided', async () => {
        const response = await request(app)
            .put(api_url)
            .set('Authorization', token)
            .send({ minuti: 30 });
        expect(response.statusCode).toBe(400);
    });

    test('PUT /api/v1/sessione should respond with status 201 if minuti and data are provided and sesseion does no exists', async () => {
        const response = await request(app)
            .put(api_url)
            .set('Authorization', token)
            .send({ minuti: 30, date: '2020-11-01' });
        expect(response.statusCode).toBe(201);
    });

    /*
    test('PUT /api/v1/sessione should respond with status 200 if minuti and data are provided and sesseion exists', async () => {        
        await SessioneModel.create({ idUtente: sessione.idUtente, minuti: 30, date: '2020-11-01' });
        const response = await request(app)
            .put(api_url)
            .set('Authorization', token)
            .send({ minuti: 30, date: '2020-11-01' });
        expect(response.statusCode).toBe(200);
    });*/

    // status 500

    test('PUT /api/v1/sessione should respond with status 500 ', async () => {
        const mockSessione = jest.spyOn(SessioneModel, 'findOne');
        mockSessione.mockImplementation(() => {
            throw new Error('Mock error');
        });

        const response = await request(app)
            .put(api_url)
            .set('Authorization', token)
            .send({ minuti: 30, date: '2020-11-01' });
        expect(response.statusCode).toBe(500);

        mockSessione.mockRestore();
    } );

    test('PUT /api/v1/sessione should respond with status 500 if erros is in salvaSession ', async () => {
        const mockSessione = jest.spyOn(GestoreDB, 'salvaSessione');

        mockSessione.mockImplementation(() => {
            throw new Error('Mock error');
        });

        const response = await request(app)
            .put(api_url)
            .set('Authorization', token)
            .send({ minuti: 30, date: '2020-11-01' });
        expect(response.statusCode).toBe(500);

        mockSessione.mockRestore();
    } );
    

});

