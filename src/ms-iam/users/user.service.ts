import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Machine } from '../machine/machine.schema';

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

  async findMachinesByUser(userId: string): Promise<Machine[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.machineModel.find({ area_id: user.area_id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('area_id', '_id description').exec(); // Populate el área
  }

  findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate('area_id', '_id description').exec(); // Populate el área
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
