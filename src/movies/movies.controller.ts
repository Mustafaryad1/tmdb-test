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
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { query } from 'express';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';

@Controller('movies')
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
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
