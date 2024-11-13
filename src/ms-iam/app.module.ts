import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AreasModule } from './area/area.module';
import { MachineModule } from './machine/machine.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
    }),
    UserModule,  
    AuthModule,  
    AreasModule,
    MachineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

