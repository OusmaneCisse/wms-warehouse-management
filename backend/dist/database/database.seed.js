"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = runSeed;
const bcrypt = require("bcrypt");
const role_entity_1 = require("../users/entities/role.entity");
const user_entity_1 = require("../users/entities/user.entity");
async function runSeed(dataSource) {
    const roleRepo = dataSource.getRepository(role_entity_1.Role);
    const userRepo = dataSource.getRepository(user_entity_1.User);
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
    try {
        const Warehouse = (await Promise.resolve().then(() => require('../warehouses/entities/warehouse.entity'))).Warehouse;
        const Zone = (await Promise.resolve().then(() => require('../warehouses/entities/zone.entity'))).Zone;
        const Location = (await Promise.resolve().then(() => require('../locations/entities/location.entity'))).Location;
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
    }
    catch {
    }
}
//# sourceMappingURL=database.seed.js.map