import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('movements')
  createMovement(@Body() dto: {
    type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT';
    productId: number;
    quantity: number;
    locationFromId?: number;
    locationToId?: number;
    notes?: string;
  }) {
    return this.stockService.createMovement(dto);
  }

  @Get('product/:productId')
  getByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.getStockByProduct(productId);
  }

  @Get('low-stock')
  getLowStock() {
    return this.stockService.getLowStockProducts();
  }

  @Get('movements')
  getMovements(
    @Query('productId') productId?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.stockService.getMovements(
      productId ? parseInt(productId, 10) : undefined,
      type,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
