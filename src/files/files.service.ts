import { Injectable, Req } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly FilesRepository: Repository<File>,
    @InjectRepository(User)
    private readonly usersRepositort: Repository<User>,
  ) {}

  async create(createFileDto: CreateFileDto, @Req() request: any) {
    const user = await this.usersRepositort.findOne({
      where: { id: request?.user?.id },
    });
    createFileDto.user = user;
    return this.FilesRepository.save(createFileDto);
  }

  findAll() {
    return this.FilesRepository.findBy({ title: Not('') });
  }

  findOne(id: string) {
    return this.FilesRepository.findBy({ id });
  }
  findOneByfilename(filename: string) {
    return this.FilesRepository.findOne({ where: { filename: filename } });
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    console.log(updateFileDto);
    return this.FilesRepository.update(id, updateFileDto);
  }

  remove(id: string) {
    return this.FilesRepository.delete(id);
  }
}
