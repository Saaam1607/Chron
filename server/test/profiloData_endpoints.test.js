const request = require('supertest');
const mongoose = require('mongoose');
const Credenziali = require('../src/models/UserSchema');
const GestoreDB = require('../src/components/gestoreDB/gestoreDB');
const GestoreEmail = require('../src/components/gestoreEmail/gestoreEmail');
const leggiToken = require('../src/routes/leggiToken');
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

describe('API /api/v1/profiloData endpoints', () => {

    const user = {
        _id: '5f9b2c1b9d1e8c2a3c9b8b0a',
        username: 'test',
        email: 'test@example.com',
        password: 'Password123',
    };

    let token = 'Bearer ' + jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

    

    beforeEach(async () => {
        await Credenziali.deleteMany({});
        await Credenziali.create(user);
    });

    afterEach(async () => {
        await Credenziali.deleteMany({});
    });

    test('GET /api/v1/profiloData should respond with status 401 if no token is provided', async () => {
        const response = await request(app)
        .get('/api/v1/profiloData')
        .set('Accept', 'application/json');

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test('GET /api/v1/profiloData should respond with status 200 and user data', async () => {
        await Credenziali.deleteMany({});
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
        const findOneMock = jest.spyOn(Credenziali, 'findById').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .get('/api/v1/profiloData')
        .set('Authorization', token)
        .set('Accept', 'application/json');

        expect(response.status).toBe(500);

        findOneMock.mockRestore();
    });


    test('PUT /api/v1/profiloData/password should update the password and respond with status 200', async () => {
        const newPassword = 'Newpassword123';

        const response = await request(app)
        .put('/api/v1/profiloData/password')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password:user.password, nuovaPassword: newPassword });

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

    test('PUT /api/v1/profiloData/password should return an error when an error occurs', async () => {
        const findOneMock = jest.spyOn(GestoreDB, 'controllaCredenziali').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .put('/api/v1/profiloData/password')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: user.password, nuovaPassword: 'Newpassword123' });

        expect(response.status).toBe(500);

        findOneMock.mockRestore();
    });

    test('PUT /api/v1/profiloData/username should return an error when an invalid password is provided', async () => {
        const invalidPassword = 'invalid-password';
        const newUsername = 'newUsername';
    
        const response = await request(app)
          .put('/api/v1/profiloData/username')
          .set('Authorization', token)
          .set('Accept', 'application/json')
          .send({ password: invalidPassword, username: newUsername });
    
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ success: false, message: 'Errore, password errata' });
    });

    test('PUT /api/v1/profiloData/username should update the username and respond with status 200', async () => {
        const newUsername = 'newUsername';

        const response = await request(app)
        .put('/api/v1/profiloData/username')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: user.password, username: newUsername });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test('PUT /api/v1/profiloData/username should return an error with status code 500 if an error occurs', async () => {
        const newUsername = 'newUsername';

        const findOneAndUpdateMock = jest.spyOn(GestoreDB, 'modificaUsername').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .put('/api/v1/profiloData/username')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: user.password, username: newUsername });

        expect(response.status).toBe(500);

        findOneAndUpdateMock.mockRestore();
    });

    
    test('PUT /api/v1/profiloData/email should send a confirmation email and respond with status 200', async () => {
        const newEmail = 'newemail@example.com';

        const response = await request(app)
        .put('/api/v1/profiloData/email')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: user.password, email: newEmail });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('PUT /api/v1/profiloData/email should return an error with status code 401 when an invalid password is provided', async () => {
        const invalidPassword = 'invalid-password';
        const newEmail = 'newemail@example.com';

        const response = await request(app)
        .put('/api/v1/profiloData/email')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: invalidPassword, email: newEmail });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test('PUT /api/v1/profiloData/email should return an error with status code 500 if an error occurs', async () => {
        const newEmail = 'newemail@example.com';

        const findOneAndUpdateMock = jest.spyOn(GestoreDB, 'controllaCredenziali').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .put('/api/v1/profiloData/email')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ password: user.password, email: newEmail });

        expect(response.status).toBe(500);

        findOneAndUpdateMock.mockRestore();
    });

    test('PUT /api/v1/profiloData/verifica-email should return an error with status 409 when non existing token is provided', async () => {        
        const newEmail = 'newemail@example.com';
        const tokenConferma = 'non-existing-token'

        const response = await request(app)
        .put('/api/v1/profiloData/verifica-email')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ token: tokenConferma });

        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);

    });


    /*
    test('PUT /api/v1/profiloData/verifica-email should return an error with status 500', async () => {
        const mock = jest.spyOn(GestoreDB, 'checkIfTokenExist').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const newEmail = 'newemail@example.com';
        const tokenConferma = jwt.sign({ email: newEmail, id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })


        const response = await request(app)
        .put('/api/v1/profiloData/verifica-email')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .send({ token: tokenConferma });

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        mock.mockRestore();
    });
    */ 




});