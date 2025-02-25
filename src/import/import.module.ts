import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from 'src/questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Question])],
  providers: [ImportService],
  controllers: [ImportController],
})
export class ImportModule {}
