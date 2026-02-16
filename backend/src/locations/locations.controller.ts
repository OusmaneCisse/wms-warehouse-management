import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('zone/:zoneId')
  findByZone(@Param('zoneId', ParseIntPipe) zoneId: number) {
    return this.service.findByZone(zoneId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: { zoneId: number; code: string; aisle?: string; rack?: string; level?: string }) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Record<string, unknown>) {
    return this.service.update(id, dto as any);
  }
}
