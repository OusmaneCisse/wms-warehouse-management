"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const dbPath = process.env.DB_PATH || 'data/wms.sqlite';
    const dataDir = (0, path_1.dirname)(dbPath);
    if (!(0, fs_1.existsSync)(dataDir)) {
        (0, fs_1.mkdirSync)(dataDir, { recursive: true });
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api/v1');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`WMS API running on http://localhost:${port}/api/v1`);
}
bootstrap().catch(console.error);
//# sourceMappingURL=main-railway.js.map