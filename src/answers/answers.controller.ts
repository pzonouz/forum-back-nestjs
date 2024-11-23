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
    await this.questionService.update(
      answer?.question?.id,
      { solved: true },
      req.user,
    );
    return await this.answersService.update(id, { solving: true }, req.user);
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
  remove(@Param('id') id: string, @Request() req: any) {
    return this.answersService.remove(id, req.user);
  }
}
