import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

const gql = '/graphql';
describe('AppController', () => {
    let app: INestApplication;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        testService = app.get(TestService);
    });

    describe('Mutation register', () => {
        beforeEach(async () => {
            await testService.deleteUser();
        });
        it('should success register user', async () => {
            const queryData = {
                query: `mutation {
                    register(request: {
                        name: "test",
                        email: "test@test.com",
                        password: "12345678"
                    }) {
                        user {
                            id
                            email
                            name
                        } 
                    }
                }`,
            };
            const response = await request(app.getHttpServer())
                .post(gql)
                .send(queryData);
            console.log(response.body.data.register);

            expect(response.body.data.register.user.name).toBe('test');
            expect(response.body.data.register.user.email).toBe(
                'test@test.com',
            );
            expect(response.body.data.register.user.id).toBeDefined();
        });
    });

    describe('Mutation login', () => {
        beforeEach(async () => {
            await testService.deleteUser();
            await testService.createUser();
        });
        it('should success login user', async () => {
            const queryData = {
                query: `mutation {
                    login(request: {
                        email: "test@test.com",
                        password: "12345678"
                    }) {
                        token 
                    }
                }`,
            };

            const response = await request(app.getHttpServer())
                .post(gql)
                .send(queryData);

            console.log(response.body.data.login);

            expect(response.body.data.login.token).toBeDefined();
        });
    });
});
