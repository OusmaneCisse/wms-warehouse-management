import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/role.entity';
import { User } from '../users/entities/user.entity';

export async function runSeed(dataSource: DataSource): Promise<void> {
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);

  const existingRoles = await roleRepo.count();
  if (existingRoles === 0) {
    await roleRepo.insert([
      { name: 'ADMIN', description: 'Administrateur - accès complet' },
      { name: 'MANAGER', description: 'Gestionnaire - gestion produits, stock, commandes' },
      { name: 'WAREHOUSE', description: 'Magasinier - réception, livraison, mouvements' },
      { name: 'VIEWER', description: 'Lecture seule - consultation rapports et stock' },
    ]);
    console.log('[Seed] Rôles créés');
  }

  const adminRole = await roleRepo.findOne({ where: { name: 'ADMIN' } });
  if (adminRole) {
    const existingAdmin = await userRepo.findOne({ where: { email: 'admin@wms.local' } });
    if (!existingAdmin) {
      const hash = await bcrypt.hash('Admin123!', 12);
      await userRepo.insert({
        email: 'admin@wms.local',
        passwordHash: hash,
        firstName: 'Admin',
        lastName: 'WMS',
        roleId: adminRole.id,
      });
      console.log('[Seed] Utilisateur admin créé (admin@wms.local / Admin123!)');
    }
  }

  // Entrepôt, zone et emplacement par défaut
  try {
    const Warehouse = (await import('../warehouses/entities/warehouse.entity')).Warehouse;
    const Zone = (await import('../warehouses/entities/zone.entity')).Zone;
    const Location = (await import('../locations/entities/location.entity')).Location;
    const whRepo = dataSource.getRepository(Warehouse);
    const zoneRepo = dataSource.getRepository(Zone);
    const locRepo = dataSource.getRepository(Location);
    const warehouses = await whRepo.count();
    if (warehouses === 0) {
      const wh = await whRepo.save(whRepo.create({ name: 'Entrepôt principal', code: 'WH001' }));
      const zone = await zoneRepo.save(zoneRepo.create({ warehouseId: wh.id, name: 'Zone A', code: 'A' }));
      await locRepo.save(locRepo.create({ zoneId: zone.id, code: 'A1-01' }));
      console.log('[Seed] Entrepôt principal, zone A et emplacement A1-01 créés');
    }
  } catch {
    // Tables peuvent ne pas exister encore au premier démarrage
  }
}
