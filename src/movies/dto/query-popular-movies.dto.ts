import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPopularMoviesDto {
  @ApiPropertyOptional({
    description: 'The page number',
    default: 1,
    minimum: 1,
  })
  page: number;
}
