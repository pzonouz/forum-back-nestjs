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
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/guards/auth-guard';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req: any,
  ) {
    createQuestionDto.userId = req?.user?.sub;
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOneById(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(+id, updateQuestionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
