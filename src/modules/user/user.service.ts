import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.create(dto);
    return user;
  }

  async getUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id);
  }
}
