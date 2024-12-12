import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { ResetPasswordCallbackDto } from 'src/auth/dto/reset-password-callback.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const exisingUser = await this.findOneEmail(createUserDto.email);
    if (exisingUser) {
      throw new HttpException('این ایمیل قبلا ثبت شده', 400);
    }
    const salt = bcrypt.genSaltSync();
    createUserDto.password = bcrypt.hashSync(
      createUserDto.password.toString(),
      salt,
    );
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
      select: ['id', 'email', 'password', 'firstname', 'lastname', 'is_admin'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOneById(id);
    if (existingUser) {
      const salt = bcrypt.genSaltSync();
      updateUserDto.password = bcrypt.hashSync(
        updateUserDto.password.toString(),
        salt,
      );
      return this.userRepository.update(id, updateUserDto);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
  async resetPassword(resetPassword: ResetPasswordDto) {
    const user = await this.findOneEmail(resetPassword.email);
    if (!user) {
      throw new HttpException('این ایمیل وجود ندارد', 404);
    }
    user.reset_password_token = randomUUID().toString();
    user.reset_password_token_expires = new Date(Date.now() + 60 * 60 * 24);
    await this.mailService.sendMail(
      resetPassword.email,
      'بازیابی رمز عبور',
      '',
      `<a href='http://localhost:3000/reset-password/${user.reset_password_token}'>بازیابی رمز عبور</a>`,
    );
    return this.userRepository.update(user.id, user);
  }
  async resetPasswordCallback(
    resetPasswordCallbackDto: ResetPasswordCallbackDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { reset_password_token: resetPasswordCallbackDto.token },
    });
    if (!user) {
      throw new HttpException('این لینک معتبر نیست', 404);
    }
    const now = new Date();
    const expires = new Date(user.reset_password_token_expires);
    if (now.getTime() > expires.getTime()) {
      throw new HttpException('لینک منقضی شده است', 401);
    }
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(
      resetPasswordCallbackDto.password.toString(),
      salt,
    );
    user.reset_password_token = null;
    user.reset_password_token_expires = null;
    return this.userRepository.update(user.id, user);
  }
}
