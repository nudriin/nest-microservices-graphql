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
                    data {
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

            expect(response.body.data.register.data.name).toBe('test');
            expect(response.body.data.register.data.email).toBe(
                'test@test.com',
            );
            expect(response.body.data.register.data.id).toBeDefined();
        });
    });
});
