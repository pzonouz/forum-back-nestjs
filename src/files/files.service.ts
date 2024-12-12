import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly FilesRepository: Repository<File>,
  ) {}

  async create(createFileDto: CreateFileDto) {
    return this.FilesRepository.save(createFileDto);
  }

  findAll() {
    return this.FilesRepository.findBy({ title: Not('') });
  }

  findOne(id: string) {
    return this.FilesRepository.findOneBy({ id });
  }
  findOneByfilename(filename: string) {
    return this.FilesRepository.findOne({ where: { filename: filename } });
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    return this.FilesRepository.update(id, updateFileDto);
  }

  remove(id: string) {
    return this.FilesRepository.delete(id);
  }
}
