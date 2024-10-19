import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';  // Importa el UserModule

@Module({
  imports: [UserModule],  // Asegúrate de importar el UserModule
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}