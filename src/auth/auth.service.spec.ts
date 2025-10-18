import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            role: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería registrar un nuevo usuario', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);
    prisma.role.findUnique = jest.fn().mockResolvedValue({ id: 1, name: 'User' });
    prisma.user.create = jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName1: 'User',
      roleId: 1,
      role: { name: 'User' },
    });

    const result = await service.register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      middleName: '',
      lastName1: 'User',
      lastName2: '',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.access_token).toBeDefined();
  });
});
