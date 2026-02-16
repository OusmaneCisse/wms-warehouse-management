import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(
    @InjectRepository(Role)
    private repo: Repository<Role>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }
}
