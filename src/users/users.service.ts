import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const exisingUser = await this.findOneEmail(createUserDto.email);
    if (exisingUser) {
      throw new HttpException('این ایمیل قبلا ثبت شده', 400);
    }
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOneById(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }
  findOneEmail(email: string) {
    return this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'password', 'firstname', 'lastname'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOneById(id);
    if (existingUser) {
      return this.userRepository.update(id, updateUserDto);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
