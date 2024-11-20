import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(ApiKeyGuard)
@ApiTags('Movies')
@ApiSecurity('x-api-key')
@Controller('movies')
@ApiHeader({
  name: 'x-api-key',
  description: 'please ask admin to retreive it',
  required: true,
  schema: {
    type: 'string',
  },
})
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('/sync-with-tmdb')
  async syncWithTmdb() {
    return this.moviesService.syncWithTmdb();
  }

  @Post()
  async create(@Body() body: CreateMovieDto) {
    return this.moviesService.create(body);
  }

  @Get()
  async findAll(@Query() query: FilterPopularMoviesDto) {
    return this.moviesService.findAll(query);
  }

  @Get('tmdb')
  async getMoviesFromTMDP(@Query() query: FilterPopularMoviesDto) {
    return this.moviesService.getMoviesFromTMDP(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Get('tmdb/:id')
  async getMovieByIdFromTMDP(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieByIdFromTMDP(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
