"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
let app;
async function bootstrap() {
    if (!app) {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: process.env.CORS_ORIGIN?.split(',') || ['https://wms-warehouse-management.vercel.app'],
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
        await app.init();
    }
    return app;
}
async function handler(req, res) {
    const app = await bootstrap();
    const server = app.getHttpServer();
    server.emit('request', req, res);
}
//# sourceMappingURL=vercel.js.map