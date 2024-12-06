import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Machine } from '../machine/machine.schema';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Machine.name) private machineModel: Model<Machine> // Inyecta el modelo de Machine
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    if (!password || typeof password !== 'string') {
      throw new Error('La contraseña es obligatoria y debe ser una cadena de texto');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });

    return createdUser.save();
  }

  async resetPassword(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    const newPassword = Math.random().toString(36).slice(-8); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587,
      secure: false,
      auth: {
        user: 'questapp64@gmail.com',
        pass: 'waao uzvb anvn ewmf', 
      },
    });
  
    // Contenido del correo
    const mailOptions = {
      from: '"Soporte QuestApp" <questapp64@gmail.com>',
      to: user.email,
      subject: 'Restablecimiento de Contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333;">Restablecimiento de Contraseña</h2>
            <p style="font-size: 16px; color: #555;">Hola, <strong>${user.name}</strong></p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center;">
            <p style="font-size: 18px; margin: 0; color: #333;">Tu nueva contraseña es:</p>
            <p style="font-size: 24px; margin: 10px 0; font-weight: bold; color: #007bff;">${newPassword}</p>
          </div>
          <p style="font-size: 14px; color: #555; margin-top: 20px;">
            Por favor, utiliza esta contraseña para iniciar sesión y asegúrate de cambiarla inmediatamente después para mantener tu cuenta segura.
          </p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    return true;
  }
  

  async findMachinesByUser(userId: string): Promise<Machine[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.machineModel.find({ area_id: user.area_id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('area_id', '_id description').exec(); 
  }

  findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate('area_id', '_id description').exec(); 
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
