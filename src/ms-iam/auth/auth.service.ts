import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
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

    // Generar accessToken con un tiempo de expiración muy corto (por ejemplo, 10 segundos)
    const accessToken = jwt.sign({ userId: user._id, email: user.email }, this.jwtSecret, { expiresIn: '10s' });
    console.log('Generated access token:', accessToken);

    // Generar refreshToken con un tiempo de expiración corto para pruebas (por ejemplo, 30 segundos)
    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, this.jwtRefreshSecret, { expiresIn: '30s' });
    console.log('Generated refresh token:', refreshToken);

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

      const newAccessToken = jwt.sign(
        { userId: (decoded as any).userId, email: (decoded as any).email },
        this.jwtSecret,
        { expiresIn: '10s' }  // Vuelve a generar el accessToken con un tiempo corto de expiración
      );

      let newRefreshToken = refreshToken;

      // Si el refreshToken está a punto de expirar, genera uno nuevo
      const now = Math.floor(Date.now() / 1000);
      const refreshExpiration = (decoded as any).exp;
      const refreshTokenIsAboutToExpire = refreshExpiration - now < 10; // Renueva si faltan menos de 10 segundos

      if (refreshTokenIsAboutToExpire) {
        newRefreshToken = jwt.sign(
          { userId: (decoded as any).userId, email: (decoded as any).email },
          this.jwtRefreshSecret,
          { expiresIn: '30s' }  // También puedes cambiar el tiempo del refreshToken para las pruebas
        );
      }

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
