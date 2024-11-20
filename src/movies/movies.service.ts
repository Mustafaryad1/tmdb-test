import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TMDPMovieGateway } from './tmdp-movie.gateway';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MoviesService {
  private readonly tmdpMovieCacheKey = 'tmdp-movies';
  constructor(
    private readonly tmdpMovieGateway: TMDPMovieGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
  ) {}

  @Cron('0 0 * * *')
  async syncWithTmdb() {
    const movies = await this.tmdpMovieGateway.getMovies({
      page: 1,
      genres: undefined,
      perPage: undefined,
    });

    if (!movies) return { message: 'No movies found!' };

    const operations = movies.results.map(async (movie) => {
      const {
        id: tmdbId,
        title,
        overview: description,
        release_date: releaseDate,
        vote_average: rating,
        poster_path: posterUrl,
        genre_ids,
        popularity,
      } = movie;

      const genresNames = await this.tmdpMovieGateway.convertGenresIdsToNames(
        genre_ids,
      );

      return this.prismaService.movie.upsert({
        where: { tmdbId },
        update: {
          title,
          description,
          releaseDate: new Date(releaseDate),
          rating,
          posterUrl: `https://image.tmdb.org/t/p/w500${posterUrl}`,
          genres: { set: genresNames },
          popularity,
          lastSyncedAt: new Date(),
        },
        create: {
          tmdbId,
          title,
          description,
          releaseDate: new Date(releaseDate),
          rating,
          posterUrl: `https://image.tmdb.org/t/p/w500${posterUrl}`,
          genres: { set: genresNames },
          popularity,
        },
      });
    });

    await Promise.all(operations); // Execute all operations concurrently
    return { message: 'Movies synchronized successfully!' };
  }

  async create({ releaseDate, ...body }: CreateMovieDto) {
    const movie = await this.prismaService.movie.create({
      data: {
        ...body,
        releaseDate: new Date(releaseDate),
      },
    });
    return movie;
  }

  async findAll(query: FilterPopularMoviesDto) {
    const { page = 0, perPage = 20 } = query;
    const cacheKey =
      this.tmdpMovieCacheKey + `movie-system-query-${JSON.stringify(query)}`;
    const cachedMovies = await this.cacheManager.get(cacheKey);
    const filters = {};
    if (query.genres) filters['genres'] = { hasSome: query.genres };

    if (cachedMovies) return cachedMovies;
    else {
      const movies = await this.prismaService.movie.findMany({
        where: {
          ...filters,
        },
        take: perPage,
        skip: page * perPage,
        orderBy: { popularity: 'desc' },
      });
      await this.cacheManager.set(cacheKey, movies, 1000 * 60 * 60);
      return { page, results: movies };
    }
  }

  async getMoviesFromTMDP(query: FilterPopularMoviesDto) {
    const cacheKey =
      this.tmdpMovieCacheKey + `movie-tmdp-query-${JSON.stringify(query)}`;
    const cachedMovies = await this.cacheManager.get(cacheKey);

    if (cachedMovies) {
      return cachedMovies;
    } else {
      const movies = await this.tmdpMovieGateway.getMovies(query);
      await this.cacheManager.set(cacheKey, movies, 1000 * 60 * 60);
      return movies;
    }
  }

  async getMovieByIdFromTMDP(id: number) {
    return this.tmdpMovieGateway.getMovieById(id);
  }

  async findOne(id: number) {
    const movie = await this.prismaService.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with id ${id} not found`);
    return movie;
  }

  async update(id: number, { releaseDate, ...body }: UpdateMovieDto) {
    await this.findOne(id);

    return this.prismaService.movie.update({
      where: { id },
      data: {
        ...body,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prismaService.movie.delete({ where: { id } });
  }
}
