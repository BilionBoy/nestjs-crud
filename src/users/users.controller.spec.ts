import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              findUnique: jest.fn().mockResolvedValue(mockUser),
              update: jest.fn().mockResolvedValue(mockUpdatedUser), // Mock de update com nome alterado
              delete: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should update a user', async () => {
    const updatedUser = await controller.update('1', { name: 'João Silva' });
    // Verificando se o nome foi atualizado corretamente
    expect(updatedUser).toEqual(mockUpdatedUser);
  });

  it('should remove a user', async () => {
    const user = await controller.remove('1');
    expect(user).toEqual(mockUser);
  });
});
