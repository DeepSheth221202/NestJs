import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email: email,
          password: password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      }
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

    service = module.get(AuthService);
  });

  it('can create an instace of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signUp('test@test.com', 'deep');
    expect(user.password).not.toEqual('deep');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws error if user signsup with email that is already exist!', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await service.signUp('test2323@test.com', 'deep');
    await expect(service.signUp('test2323@test.com', 'deep')).rejects.toThrow();
  });

  it('throws error if user signin with email that do not exist!', async () => {
    await expect(service.signIn('test2323@test.com', 'deep')).rejects.toThrow();
  });

  it('throws error if user signin with wrong password', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: 'deep' } as User]);
    await service.signUp('test2323@test.com', 'deep');
    await expect(
      service.signIn('test2323@test.com', 'sdfsdf'),
    ).rejects.toThrow();
  });

  it('returns a user if correct credentials are provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'a',
    //       password:
    //         'dfeefa256e672cee.2f1ecaaeb012286cf3b2420aaae918fdf7c1ec6c9fc3ab44b85801e182587cd9',
    //     } as User,
    //   ]);
    await service.signUp('test2323@test.com', 'deep');
    const user = await service.signIn('test2323@test.com', 'deep');
    expect(user).toBeDefined();
  });
});
