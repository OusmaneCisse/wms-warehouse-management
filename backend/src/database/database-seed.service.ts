import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeed } from './database.seed';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await runSeed(this.dataSource);
    } catch (err) {
      console.error('[Seed] Erreur:', err);
    }
  }
}
