import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { QuestionsService } from 'src/questions/questions.service';

@Controller('answers')
export class AnswersController {
  constructor(
    private readonly answersService: AnswersService,
    private readonly questionService: QuestionsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req: any, @Body() createAnswerDto: CreateAnswerDto) {
    createAnswerDto.userId = req.user.id;
    return this.answersService.create(createAnswerDto);
  }

  @Get()
  findAll() {
    return this.answersService.findAll();
  }

  @Get('question/:id')
  findAllByQuestionId(@Param('id') id: string) {
    return this.answersService.findAllByQuestionId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const answer = await this.answersService.findOneById(id);
    if (answer) {
      return answer;
    }
    throw new HttpException('Answer Not Found', 404);
  }

  @UseGuards(AuthGuard)
  @Patch('solving/:id')
  async solving(@Param('id') id: string, @Request() req: any) {
    const answer = await this.answersService.findOneById(id);
    if (!answer) {
      throw new HttpException('Answer Not Found', 404);
    }
    if (answer?.question?.user?.id !== req?.user?.id) {
      throw new HttpException('Only Owner can solve answer', 401);
    }
    const allAnswers = await this.answersService.findAllByQuestionId(
      answer?.question?.id,
    );
    const otherAnswerIsSolving = allAnswers.filter(
      (a) => a.id != answer?.id && a?.solving,
    );
    if (otherAnswerIsSolving.length > 0) {
      throw new HttpException('Only one answer can be solved at a time', 400);
    }
    const res = await this.answersService.updateWithoutAuth(id, {
      solving: !answer?.solving,
    });
    return this.questionService.checkQuestionSolved(answer?.question?.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Request() req: any,
  ) {
    const answer = this.answersService.findOneById(id);
    if (answer) {
      return this.answersService.update(id, updateAnswerDto, req.user);
    }
    throw new HttpException('Answer Not Found', 404);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.answersService.remove(id, req.user);
    const question = await this.questionService.findOneById(id);
    return this.questionService.checkQuestionSolved(question?.id);
  }
}
