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

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    const answer = this.answersService.findOneById(id);
    if (answer) {
      return this.answersService.update(+id, updateAnswerDto);
    }
    throw new HttpException('Answer Not Found', 404);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answersService.remove(+id);
  }
}
