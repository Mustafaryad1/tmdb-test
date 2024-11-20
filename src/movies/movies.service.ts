import { Inject, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TMDPMovieGateway } from './tmdp-movie.gateway';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MoviesService {
  private readonly tmdpMovieCacheKey = 'tmdp-movies';
  constructor(
    private readonly tmdpMovieGateway: TMDPMovieGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  async findAll(query: FilterPopularMoviesDto) {
    const cacheKey =
      this.tmdpMovieCacheKey + `movie-query-${JSON.stringify(query)}`;
    const cachedMovies = await this.cacheManager.get(cacheKey);

    if (cachedMovies) {
      return cachedMovies;
    } else {
      const movies = await this.tmdpMovieGateway.getMovies(query);
      await this.cacheManager.set(cacheKey, movies, 1000 * 60 * 60);
      return movies;
    }
  }

  async findOne(id: number) {
    return this.tmdpMovieGateway.getMovieById(id);
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
