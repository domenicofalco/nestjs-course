import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('can create an istance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user', async () => {
    const initialPassword = 'password';
    const user = await authService.signup('email@email.com', initialPassword);
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual(initialPassword);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an if users exists already', async () => {
    await authService.signup('email@email.com', 'password');

    expect(
      authService.signup('email@email.com', 'password'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('signs with not registered user', async () => {
    expect(
      authService.signin('email@email.com', 'password'),
    ).rejects.toThrowError(NotFoundException);
  });

  it('sign in wrong password provided', async () => {
    await authService.signup('email@email.com', 'password');

    expect(
      authService.signin('email@email.com', '1-password'),
    ).rejects.toThrowError(BadRequestException);
  });

  it('sign in correctly', async () => {
    await authService.signup('email@email.com', 'password');

    const user = await authService.signin('email@email.com', 'password');
    expect(user).toBeDefined();
  });

  it('fails to signup with same email', async () => {
    await authService.signup('email@email.com', 'password');

    expect(
      authService.signup('email@email.com', 'password'),
    ).rejects.toThrowError(BadRequestException);
  });
});
