import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The title of the movie',
    example: 'The Shawshank Redemption',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the movie',
    example: 'Two imprisoned',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The release date of the movie',
    example: '1994-10-14',
  })
  @IsDateString()
  releaseDate: Date;

  @ApiProperty({
    description: 'The movie poster url',
    example: 'https://image.tmdb.org/t/p/w500/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
  })
  @IsString()
  posterUrl: string;

  @ApiProperty({
    description: 'The move genres',
    example: ['Action', 'Adventure'],
  })
  @IsString({ each: true })
  genres: string[];
}
