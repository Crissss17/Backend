import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string }) {
    try {
      if (!body.email) {
        throw new BadRequestException('El correo electrónico es obligatorio.');
      }

      const result = await this.userService.resetPassword(body.email);

      if (!result) {
        throw new BadRequestException('El correo electrónico no está registrado.');
      }

      return { message: 'Se ha enviado una nueva contraseña a tu correo.' };
    } catch (error) {
      console.error('Error en reset-password:', error);
      throw new InternalServerErrorException('Hubo un problema al procesar tu solicitud.');
    }
  }

  @Post('change-password')
  async changePassword(@Body() { userId, newPassword }: { userId: string; newPassword: string }) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return { message: 'Contraseña actualizada correctamente.' };
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/machines')
  async findMachinesByUser(@Param('id') id: string) {
    return this.userService.findMachinesByUser(id);
  }

  @Post(':id/biometric')
  async saveBiometricId(@Param('id') id: string, @Body() body: { biometricId: string }) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    user.biometricId = body.biometricId;
    await user.save();

    return { message: 'Identificador biométrico guardado correctamente.' };
  }

  @Post('verify-biometric')
  async verifyBiometric(@Body() body: { biometricId: string }) {
    const user = await this.userService.findOne(body.biometricId );

    if (!user) {
      throw new UnauthorizedException('Datos biométricos no coinciden.');
    }

    return { message: 'Autenticación biométrica exitosa.' };
  }
}
