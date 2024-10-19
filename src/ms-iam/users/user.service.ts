import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { mongoErrorHandler } from '../utils/mongo-error-handler';
import { MongoError } from 'mongodb';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    
    // Asegúrate de que la contraseña esté definida
    if (!password || typeof password !== 'string') {
      throw new Error('La contraseña es obligatoria y debe ser una cadena de texto');
    }
    
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();  // Retorna todos los usuarios
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.updateOne({ _id: id }, updateUserDto);
    } catch (error: unknown) {
      if ((error as Record<string, number>)?.code)
        mongoErrorHandler(error as MongoError);
      throw new Error(error as string);
    }
  }

  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}