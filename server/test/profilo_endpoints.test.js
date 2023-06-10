const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const Credenziali = require('../src/models/UserSchema');
const GestoreDB = require('../src/components/gestoreDB/gestoreDB');

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
    
    const user = {
        _id: new mongoose.Types.ObjectId(),
        username: 'test',
        email: 'test@example.com',
        password: 'Password123',
    };

    const externalUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'test2',
        email: 'test1@example.com',
        password: 'test1@example.com'+process.env.CLIENT_ID,
    };
    
    let token = 'Bearer ' + jwt.sign({ id: '64765870316275628c4870b9' }, process.env.ACCESS_TOKEN_SECRET);
    const tokenRegistrazione =  jwt.sign({ emai: user.email, password: user.password, username:user.username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    


    beforeAll(() => {

    });

    afterEach(async () => {
        //await Credenziali.deleteMany({});
    });


    test('POST /api/v1/profilo/nuova-autenticazione should respond with status 400 if parameters are missing', async () => {
        const response = await request(app)
        .post(`${api_url}/nuova-autenticazione`)
        .send({email: user.email });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('I parametri "username, "email" o "password" mancanti.');
    });


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

    test('POST /api/v1/profilo/nuova-autenticazione should respond with status 400 if parameters are missing', async () => {
        const response = await request(app)
        .post(`${api_url}/nuova-autenticazione`)
        .send({email: user.email });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('I parametri "username, "email" o "password" mancanti.');

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


    test('POST /api/v1/profilo/nuova-autenticazione should respond with status 500 if an error occurs', async () => {
        const registerMock = jest.spyOn(Credenziali, 'countDocuments').mockImplementationOnce(() => {
            throw new Error('Errore generato dal mock');
        });

        const response = await request(app)
        .post(`${api_url}/nuova-autenticazione`)
        .send(user);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        registerMock.mockRestore();
    });

    test('POST /api/v1/profilo/verifica-registrazione should respond with status 400 if token is missing', async () => {
        const response = await request(app)
          .post(`${api_url}/verifica-registrazione`)
          .send({});
      
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Il parametro "token" mancante!');
    });
    
    test('POST /api/v1/profilo/verifica-registrazione should respond with status 409 if account already exists', async () => {
        // Simulate that the token already exists
        jest.spyOn(GestoreDB, 'checkIfTokenExist').mockReturnValueOnce(false);

        const response = await request(app)
          .post(`${api_url}/verifica-registrazione`)
          .send({ token: tokenRegistrazione });
      
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Account già esistente!');
    });
    
    test('POST /api/v1/profilo/verifica-registrazione should respond with status 201 and success message if registration is successful', async () => {
        jest.spyOn(GestoreDB, 'checkIfTokenExist').mockReturnValueOnce(true);

        const response = await request(app)
          .post(`${api_url}/verifica-registrazione`)
          .send({ token: tokenRegistrazione });
      
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Account registrato con successo!');
    });

    test('POST /api/v1/profilo/verifica-registrazione should respond with status 500 if an error occurs', async () => {
        jest.spyOn(GestoreDB, 'checkIfTokenExist').mockReturnValueOnce(true);
        jest.spyOn(GestoreDB, 'registra').mockRejectedValueOnce(new Error('Errore durante la registrazione'));
      
        const response = await request(app)
          .post(`${api_url}/verifica-registrazione`)
          .send({ token: tokenRegistrazione });
      
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

    });

    test('POST /api/v1/profilo/richiesta-nuova-password should respond with status 400 if email is missing', async () => {
        const response = await request(app)
          .post(`${api_url}/richiesta-nuova-password`)
          .send({});
      
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Il parametro "email" mancante!');
    });

    test('POST /api/v1/profilo/richiesta-nuova-password should respond with status 404 if user is not found with the provided email', async () => {
        // Mock the function to return null, indicating user not found
        //jest.spyOn(GestoreDB, 'getDataFromEmail').mockResolvedValueOnce(null);
      
        const response = await request(app)
          .post(`${api_url}/richiesta-nuova-password`)
          .send({ email: 'nonexistent@example.com' });
      
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Utente non trovato con l\'email fornita!');
    });

    test('POST /api/v1/profilo/richiesta-nuova-password should respond with status 409 if account was created with external registration', async () => {
        // Mock the function to return a successful login, indicating an externally registered account
        //jest.spyOn(GestoreDB, 'login').mockResolvedValueOnce(true);
        
        Credenziali.create(externalUser);

        const response = await request(app)
          .post(`${api_url}/richiesta-nuova-password`)
          .send({ email: externalUser.email });
      
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
    });

    test('POST /api/v1/profilo/richiesta-nuova-password should respond with status 200 and success message if password reset email send successful', async () => {
        
        await Credenziali.deleteMany({});
        await Credenziali.create(user);

        const response = await request(app)
          .post(`${api_url}/richiesta-nuova-password`)
          .send({ email: user.email });
      
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test('POST /api/v1/profilo/richiesta-nuova-password should respond with status 500 if an error occurs', async () => {
        jest.spyOn(GestoreDB, 'getDataFromEmail').mockRejectedValueOnce(new Error('Errore'));
        
        const response = await request(app)
          .post(`${api_url}/richiesta-nuova-password`)
          .send({ email: user.email });
      
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

    });

    test('POST /api/v1/profilo/richiesta-reset-password should respond with status 400 if token or password is missing', async () => {
        const response = await request(app)
          .post(`${api_url}/richiesta-reset-password`)
          .send({ token: 'valid-token' });
      
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('I parametri "token" o "password" sono mancanti!');
    });


    test('POST /api/v1/profilo/richiesta-reset-password should respond with status 401 if token is invalid or expired', async () => {
        // Mock a JWT token verification error
        jest.spyOn(jwt, 'verify').mockImplementationOnce((token, secret, callback) => {
          const error = new Error('Invalid or expired token');
          callback(error);
        });
      
        const response = await request(app)
          .post(`${api_url}/richiesta-reset-password`)
          .send({ token: 'invalid-token', password: 'newPassword123' });
      
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Token non valido o scaduto! Invalid or expired token');
    });

    test('POST /api/v1/profilo/richiesta-reset-password should respond with status 200 and success message if password update is successful', async () => {
        // Mock the password update function to resolve successfully
        //jest.spyOn(GestoreDB, 'aggiornaPassword').mockResolvedValueOnce();
      
        const response = await request(app)
          .post(`${api_url}/richiesta-reset-password`)
          .send({ token: tokenRegistrazione, password: 'newPassword123' });
      
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Password aggiornata con successo!');
    });
    
    test('POST /api/v1/profilo/richiesta-reset-password should respond with status 500 if an error occurs during password update', async () => {
        // Mock the password update function to reject with an error
        jest.spyOn(GestoreDB, 'aggiornaPassword').mockRejectedValueOnce(new Error('Password update error'));
      
        const response = await request(app)
          .post(`${api_url}/richiesta-reset-password`)
          .send({ token: tokenRegistrazione, password: 'newPassword123' });      
          
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('L\'operazione di ripristino della password non è andato a buon fine. Password update error');
    });

});

