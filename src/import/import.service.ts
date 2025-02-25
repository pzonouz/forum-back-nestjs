import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { randomUUID } from 'crypto';
import { Question } from 'src/questions/entities/question.entity';

@Injectable()
export class ImportService {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async importDataFromCsv(filePath: string): Promise<void> {
    // const users = await this.parseCsvFile(filePath);
    const questions = await this.parseCsvFile(filePath);

    console.log(questions);
    const transformedQuestions = questions.map((q) => ({
      ...q,
      id: randomUUID().toString(),
      userId: q.user_id,
      // firstname: user?.nickname.split(' ')[0],
      // lastname: user?.nickname.split(' ')[1],
      // role: undefined,
    }));

    // await this.questionRepository.upsert(transformedQuestions, ['email']);
    await this.questionRepository.save(transformedQuestions);
  }

  private parseCsvFile(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
