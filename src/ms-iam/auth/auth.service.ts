import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'miSuperSecreto';
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'miRefreshSecreto';

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Servicio de Login
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const accessToken = jwt.sign({ userId: user._id, email: user.email }, this.jwtSecret, { expiresIn: '3m' });
    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, this.jwtRefreshSecret, { expiresIn: '5m' });

    return { accessToken, refreshToken };
  }

  // Servicio para verificar el token (checkToken)
  async checkToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: 'Token inválido o expirado' };
    }
  }

  // Servicio para refrescar el token (refreshToken)
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);
      const newAccessToken = jwt.sign({ userId: (decoded as any).userId, email: (decoded as any).email }, this.jwtSecret, { expiresIn: '10s' });
      const newRefreshToken = jwt.sign({ userId: (decoded as any).userId, email: (decoded as any).email }, this.jwtRefreshSecret, { expiresIn: '20s' });
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
  
}
