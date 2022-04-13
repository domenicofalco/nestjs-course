import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle a signup request', () => {
    const mockEmail = 'email2@email.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: mockEmail,
        password: 'password',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(mockEmail);
      });
  });

  it('signup new user and then get current logged in user', async () => {
    const mockEmail = 'email2@email.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: mockEmail,
        password: 'password',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(mockEmail);
  });
});
