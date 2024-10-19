import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  // Registro del esquema del usuario
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],  // Exportar MongooseModule y UserService para que estén disponibles en otros módulos
})
export class UserModule {}
