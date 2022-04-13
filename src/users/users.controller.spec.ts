import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'email@email.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'password',
          } as User,
        ]);
      },
      // remove: () => null,
      // update: () => null,
    };

    fakeAuthService = {
      // signup: () => null,
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns list of users with given email', async () => {
    const users = await controller.findAllUsers('email@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('email@email.com');
  });

  it('findUser returns single user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    expect(controller.findUser('2')).rejects.toThrowError(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -1 }; // userId fake initialized to avoid typescript err
    const user = await controller.signin(
      {
        email: 'email@email.com',
        password: 'password',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(user.id).toEqual(session.userId);
  });
});
