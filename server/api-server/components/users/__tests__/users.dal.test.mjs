import _ from 'lodash';
import db from '../../../common/models';
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
});
