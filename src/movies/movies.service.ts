import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TMDPMovieGateway } from './tmdp-movie.gateway';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly tmdpMovieGateway: TMDPMovieGateway) {}

  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  async findAll(query: FilterPopularMoviesDto) {
    return this.tmdpMovieGateway.getMovies(query);
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
