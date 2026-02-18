import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { runSeed } from './database.seed';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Check if database is empty before seeding
      const userCount = await this.dataSource.query('SELECT COUNT(*) as count FROM users');
      const count = parseInt(userCount[0]?.count || '0');
      
      if (count === 0) {
        console.log('[Seed] Database empty, running seed...');
        await runSeed(this.dataSource);
        console.log('[Seed] Database seeded successfully');
      } else {
        console.log('[Seed] Database already contains data, skipping seed');
      }
    } catch (err) {
      console.error('[Seed] Error checking/seeding database:', err);
    }
  }
}
