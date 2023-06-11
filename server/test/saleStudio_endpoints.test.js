const request = require('supertest');
const mongoose = require('mongoose');
const SalaStudio = require('../src/models/SalaStudioSchema');

const app = require('../src/server');

let server;
let api_url = '/api/v1/saleStudio';


beforeAll(async () => {
    jest.setTimeout(8000);
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    //delte all collections
    await mongoose.connection.db.dropDatabase();

    server = app.listen(process.env.PORT || 8080);
});


afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});


test('app module should be defined', () => {
    expect(app).toBeDefined();
});

describe('API /api/v1/saleStudio endpoints', () => {
    
    const salaStudio = {
        _id: '5f9b2c1b9d1e8c2a3c9b8b0a',
        name: 'test',
        address: 'Trento',
        restrictions: 'test',
        rating: 5,
        openingHours: [{
            day: 'Lunedì',
            isOpen: true,
            openingTime: '08:00',
            closingTime: '20:00'
        }]
    };

    beforeEach(async () => {
        await SalaStudio.deleteMany({});
        await SalaStudio.create(salaStudio);
    });

    afterEach(async () => {
        await SalaStudio.deleteMany({});
    });

    test('GET /api/v1/saleStudio should respond with status 200', async () => {
        const response = await request(app)
        .get('/api/v1/saleStudio')
        .set('Accept', 'application/json')

        expect(response.status).toBe(200);
    });

    // filter by name

    test('GET /api/v1/saleStudio?nome=test should respond with status 200', async () => {
        const response = await request(app)
        .get('/api/v1/saleStudio?nome=test')
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });

    // filter by address

    test('GET /api/v1/saleStudio?indirizzo=Trento should respond with status 200', async () => {
        const response = await request(app)
        .get('/api/v1/saleStudio?indirizzo=Trento')
        .set('Accept', 'application/json');

        expect(response.status).toBe(200);
    });


    // status 500

    test('GET /api/v1/saleStudio?name= should respond with status 500', async () => {
        const mockFind = jest.spyOn(SalaStudio, 'find').mockImplementation(() => {
            throw new Error('Mocked error');
        });

        const response = await request(app)
        .get('/api/v1/saleStudio?name=')
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);

        mockFind.mockRestore();
    });

        
});