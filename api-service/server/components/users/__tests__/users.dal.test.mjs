import _ from 'lodash';
import db from '@root/common/models';
import usersDal from '../users.dal';

describe('UsersDAL', () => {
    describe('getAll()', () => {
        it('should return mapped list of users', async () => {
            const users = [
                {
                    id: 1,
                    firstName: 'Bob',
                    lastName: '123',
                    email: 'bob@123.com',
                    extraField: 'some extra info'
                },
                {
                    id: 2,
                    firstName: 'Jack',
                    lastName: 'Doe',
                    email: 'jack@doe.com',
                    extraField: 'some extra info about Jack'
                }
            ];

            _.extend(db, {
                Users: {
                    findAll: jest.fn(async () => users)
                }
            });

            const resultUsersList = await usersDal.getAll();
            const expectedUsersList = users.map(user =>
                _.omit(user, 'extraField')
            );

            expect(db.Users.findAll).toBeCalledWith();
            expect(resultUsersList).toEqual(expectedUsersList);
        });
    });

    describe('getByEmail()', () => {
        it('should return null if there is no such user', async () => {
            _.extend(db, {
                Users: {
                    findOne: jest.fn(async () => undefined)
                }
            });

            const testEmail = 'wrong@email.com';
            const resultUser = await usersDal.getByEmail(testEmail);

            expect(db.Users.findOne).toBeCalledWith({
                where: {
                    email: testEmail
                }
            });
            expect(resultUser).toBe(null);
        });

        it('should return exact user data', async () => {
            const testEmail = 'john-doe@email.com';

            _.extend(db, {
                Users: {
                    findOne: jest.fn(async () => ({
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        email: testEmail,
                        extraInfo: 'some extra info'
                    }))
                }
            });

            const resultUser = await usersDal.getByEmail(testEmail);

            expect(db.Users.findOne).toBeCalledWith({
                where: {
                    email: testEmail
                }
            });
            expect(resultUser).toEqual({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: testEmail
            });
        });
    });

    describe('create()', () => {
        it('should return exact user data', async () => {
            const testUser = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john-doe@email.com'
            };

            _.extend(db, {
                Users: {
                    create: jest.fn(async () => testUser)
                }
            });

            const resultUser = await usersDal.create({
                ...testUser,
                extraInfo: 'some extra info'
            });

            expect(db.Users.create).toBeCalledWith(testUser);
            expect(resultUser).toEqual(testUser);
        });
    });
});
