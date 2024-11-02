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
      throw new HttpException('user already exists', 400);
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
    return this.userRepository.findOne({ where: { email: email } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
