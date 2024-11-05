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

  
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

  
    const accessToken = jwt.sign({ userId: user._id, email: user.email }, this.jwtSecret, { expiresIn: '5m' });
    console.log('Generated access token:', accessToken);

    
    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, this.jwtRefreshSecret, { expiresIn: '7m' });
    console.log('Generated refresh token:', refreshToken);

    return { accessToken, refreshToken };
  }

  
  async checkToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error: 'Token inválido o expirado' };
    }
  }

  
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);

      const newAccessToken = jwt.sign(
        { userId: (decoded as any).userId, email: (decoded as any).email },
        this.jwtSecret,
        { expiresIn: '10s' }  
      );

      let newRefreshToken = refreshToken;

      
      const now = Math.floor(Date.now() / 1000);
      const refreshExpiration = (decoded as any).exp;
      const refreshTokenIsAboutToExpire = refreshExpiration - now < 10;

      if (refreshTokenIsAboutToExpire) {
        newRefreshToken = jwt.sign(
          { userId: (decoded as any).userId, email: (decoded as any).email },
          this.jwtRefreshSecret,
          { expiresIn: '30s' }  
        );
      }

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
