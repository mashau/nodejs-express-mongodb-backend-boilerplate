process.env.NODE_ENV = "test";
import { faker } from '@faker-js/faker';

import models, { connectDB, closeDB } from '../../models';

beforeAll(async() => {
   await connectDB();
})

afterAll(async () => {
    await models.User.deleteMany({})
    await closeDB();
})


describe('Save', ()=> {
    it("Should create user.", async() => {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        const user = models.User({ username, email, password });
        await user.save();

        const fetched = await models.User.findById(user._id);

        expect(fetched).not.toBeNull();

        expect(fetched.email).toBe(email);
        expect(fetched.username).toBe(username);
    })

    it('Should not save user without a username', async() => {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const userInfo = { email, password }

        const user = models.User(userInfo);

        await expect(user.save()).rejects.toThrowError(/username/);
    })

    it('Should not save user with same username', async() => {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const userInfo = { username, email, password }

        const user = models.User(userInfo);
        await user.save();

        const otherUser = models.User(userInfo);
        await expect(otherUser.save()).rejects.toThrowError(/E11000/);
    })

    it('Should not save unencripted password', async() => {
        const username = faker.internet.userName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        const userInfo = { username, email, password }

        const user = models.User(userInfo);
        await user.save();

        expect(user.password).not.toBe(password);
    })
})
