"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const swagger_themes_1 = require("swagger-themes");
const common_1 = require("@nestjs/common");
const ip = require("ip");
const enums_1 = require("../libs/core/src/enums");
async function bootstrap() {
    var _a;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const PORT = +((_a = config.get('PORT')) !== null && _a !== void 0 ? _a : 3000);
    const NODE_ENV = config.get('NODE_ENV');
    const SWAGGER_THEME = config.get('SWAGGER_THEME');
    app.setGlobalPrefix('api');
    if (NODE_ENV !== enums_1.EnvEnum.PRODUCTION) {
        common_1.Logger.log('cors: *');
        app.enableCors();
    }
    const swaggerOptions = new swagger_1.DocumentBuilder()
        .setTitle('ROAD JEDI API')
        .setDescription('API ROAD JEDI')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerOptions);
    const swaggerTheme = new swagger_themes_1.SwaggerTheme('v3');
    swagger_1.SwaggerModule.setup('api/docs', app, swaggerDocument, {
        explorer: true,
        customCss: swaggerTheme.getBuffer(SWAGGER_THEME),
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(PORT);
    common_1.Logger.log(`URL: http://${ip.address()}:${PORT}/api/docs`, 'Documentation');
    return common_1.Logger.log(`Listening port: ${PORT}`, 'NestFactory');
}
bootstrap();
//# sourceMappingURL=main.js.map