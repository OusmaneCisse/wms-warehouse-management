import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repo.find({ relations: ['role'], order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<User> {
    const u = await this.repo.findOne({ where: { id }, relations: ['role'] });
    if (!u) throw new NotFoundException('Utilisateur non trouvé');
    return u;
  }

  async create(dto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: number;
  }): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email déjà utilisé');
    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({
      email: dto.email,
      passwordHash: hash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleId: dto.roleId,
    });
    return this.repo.save(user);
  }
}
