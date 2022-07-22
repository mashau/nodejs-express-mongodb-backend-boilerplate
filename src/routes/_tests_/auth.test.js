process.env.NODE_ENV = "test";
import { faker } from '@faker-js/faker';
import request from 'supertest';

import models, { connectDB, closeDB } from '../../models';
import app from '../../server';

beforeAll(async () => {
    await connectDB();
})

beforeEach(async () => {
    await models.Role.create([
        { name: 'user' },
        { name: 'admin' },
        { name: 'editor' }
    ])
})

afterEach(async () => {
    await models.Role.deleteMany({})
    await models.Role.deleteMany({})
})

afterAll(async () => {
    await closeDB();
})

describe('POST /api/auth/signin', () => {
    it('Should return valid response for correct user input.', async () => {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        const userdata = { username, email, password }

        const res1 = await request(app)
            .post('/api/auth/signup')
            .send(userdata)
            .set("Accept", "application/json");

        const res2 = await request(app)
            .post('/api/auth/signin')
            .send({ login: username, password })
            .set("Accept", "application/json");

        expect(res2.statusCode).toBe(200);
        expect(res2.body).toMatchObject({
            id: expect.stringMatching(/^[a-f0-9]{24}$/)
        })
    })

    it('Should return 401 and valid respond with invalid password.', async() => {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const password2 = faker.internet.password();

        const userdata = { username, email, password }

        const res1 = await request(app)
            .post('/api/auth/signup')
            .send(userdata)
            .set("Accept", "application/json");

        const res2 = await request(app)
            .post('/api/auth/signin')
            .send({ login: username, password: password2 })
            .set("Accept", "application/json");

        expect(res2.statusCode).toBe(401);
        expect(res2.body).toMatchObject({
            message: expect.stringMatching(/username or password/)
        })
    })
})

describe('POST /api/auth/signup', () => {
    it('Should return 200 and valid response for valid user', async () => {

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            })
            .set("Accept", "application/json")

        expect(res.body).toMatchObject({
            id: expect.stringMatching(/^[a-f0-9]{24}$/)
        })

    })

    it('Should return 400 and valid response for duplicate user.', async () => {
        const userdata = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const res1 = await request(app)
            .post('/api/auth/signup')
            .send(userdata)
            .set("Accept", "application/json");

        expect(res1.statusCode).toBe(200);


        const res2 = await request(app)
            .post('/api/auth/signup')
            .send(userdata)
            .set("Accept", "application/json");

        expect(res2.statusCode).toBe(400);
        expect(res2.body).toMatchObject({
            message: expect.stringMatching(/already in use/)
        })

    })

    it('Should return valid created user role.', async () => {
        const userdata = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            roles: ['editor', 'user'],
            password: faker.internet.password(),
        }

        const res1 = await request(app)
            .post('/api/auth/signup')
            .send(userdata)
            .set("Accept", "application/json");

        expect(res1.body.roles).toContain('editor');
    })
})