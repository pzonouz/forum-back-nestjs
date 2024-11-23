import { HttpException, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    private readonly userService: UsersService,
  ) {}
  async create(createQuestionDto: CreateQuestionDto) {
    const user = await this.userService.findOneById(createQuestionDto.userId);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    const question = await this.questionsRepository.findOne({
      where: { title: createQuestionDto.title },
    });
    if (question) {
      throw new HttpException('Question already exists', 400);
    }
    return this.questionsRepository.save({ ...createQuestionDto, user: user });
  }

  findAll() {
    return this.questionsRepository.find({
      relations: { user: true, answers: true },
    });
  }

  async findOneById(id: string) {
    const question = await this.questionsRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (question) {
      return question;
    }
    throw new HttpException('Question Not Found', 404);
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    requestUser: User,
  ) {
    const question = await this.questionsRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!question) {
      throw new HttpException('Question does not exists', 404);
    }
    if (question.user?.id !== requestUser?.id) {
      throw new HttpException('Only Owener can edit question', 401);
    }

    return this.questionsRepository.update(
      { id: id },
      { ...updateQuestionDto },
    );
  }

  async remove(id: string, requestUser: User) {
    const question = await this.findOneById(id);
    if (!question) {
      throw new HttpException('Question does not exists', 404);
    }
    if (question.user.id !== requestUser.id) {
      throw new HttpException('Only Owener can edit question', 401);
    }
    return this.questionsRepository.delete({ id: id });
  }
}
