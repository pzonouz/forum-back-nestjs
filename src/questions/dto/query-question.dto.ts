import { IsNumber, IsOptional, IsString } from 'class-validator';

class QueryQuestionDto {
  @IsOptional()
  @IsString()
  sort_by?: string;

  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
export { QueryQuestionDto };
