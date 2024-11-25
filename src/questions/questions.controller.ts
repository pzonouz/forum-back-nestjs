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
  Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { QueryQuestionDto } from './dto/query-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req: any,
  ) {
    createQuestionDto.userId = req?.user?.id;
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  findAll(@Query() query: QueryQuestionDto) {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Request() req: any,
  ) {
    return this.questionsService.update(id, updateQuestionDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.remove(id, req.user);
  }
}
