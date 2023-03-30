import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { userParams } from 'src/types/userParams';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createUser(userParams: userParams): Promise<User> {
    const user = new User();
    user.firstName = userParams.firstName;
    user.lastName = userParams.lastName;
    user.email = userParams.email;
    user.password = await bcrypt.hash(userParams.password, 12);
    return this.userRepository.save(user);
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByEmail(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return null;
    return user;
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
