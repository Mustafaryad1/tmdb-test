import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The page number',
    default: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    default: 10,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  perPage: number;
}
