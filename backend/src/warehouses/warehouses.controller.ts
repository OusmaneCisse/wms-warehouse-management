import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('warehouses')
@UseGuards(JwtAuthGuard)
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Get()
  findAllWarehouses() {
    return this.service.findAllWarehouses();
  }

  @Get(':id')
  findOneWarehouse(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneWarehouse(id);
  }

  @Post()
  createWarehouse(@Body() dto: { name: string; code: string; address?: string }) {
    return this.service.createWarehouse(dto);
  }

  @Patch(':id')
  updateWarehouse(@Param('id', ParseIntPipe) id: number, @Body() dto: Record<string, unknown>) {
    return this.service.updateWarehouse(id, dto as any);
  }

  @Get(':id/zones')
  getZones(@Param('id', ParseIntPipe) id: number) {
    return this.service.getZones(id);
  }

  @Post('zones')
  createZone(@Body() dto: { warehouseId: number; name: string; code: string; description?: string }) {
    return this.service.createZone(dto);
  }
}
