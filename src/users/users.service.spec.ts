import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service'; // Importando o serviço Prisma

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mocks para o Prisma
  const mockUser = {
    id: '1',
    name: 'João',
    email: 'joao@email.com',
    password: '123456',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock para o usuário atualizado
  const mockUpdatedUser = {
    ...mockUser,
    name: 'João Silva', // Nome alterado
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              findUnique: jest.fn().mockResolvedValue(mockUser),
              update: jest.fn().mockResolvedValue(mockUpdatedUser), // Mock do update com nome alterado
              delete: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create(mockUser);
    expect(user).toEqual(mockUser);
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
  });

  it('should find one user by id', async () => {
    const user = await service.findOne('1');
    expect(user).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const updatedUser = { ...mockUser, name: 'João Silva' };
    const user = await service.update('1', { name: 'João Silva' });
    expect(user).toEqual(mockUpdatedUser); // Testando se o nome foi atualizado corretamente
  });

  it('should remove a user', async () => {
    const user = await service.remove('1');
    expect(user).toEqual(mockUser);
  });
});
