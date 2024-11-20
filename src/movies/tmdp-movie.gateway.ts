/* eslint-disable @typescript-eslint/naming-convention */
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';
import { filterMovieHelper } from './helpers/filter-movie.helper';

@Injectable()
export class TMDPMovieGateway implements OnModuleInit {
  private apiKey: string;
  private baseUrl: string;
  private genres: { genres: { id: number; name: string }[] };
  private logger: Logger;
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get('TMDB_API_KEY');
    this.baseUrl = this.configService.get('TMDP_BASE_URL');
    this.logger = new Logger(TMDPMovieGateway.name);
  }

  async onModuleInit() {
    try {
      const response = await firstValueFrom(
        this.http.get(`${this.baseUrl}/genre/movie/list`, {
          params: { api_key: this.apiKey },
        }),
      );
      this.genres = response.data;
      this.logger.log(`Genres fetched from tmdp`);
    } catch (err) {
      console.warn(`Can not fetch that from tmdp`, err);
      process.exit(1);
    }
  }

  async getMovies(query: FilterPopularMoviesDto): Promise<any> {
    const url = `${this.baseUrl}/discover/movie`;
    const filters = { page: query.page };
    filterMovieHelper(query, filters, this.genres);

    try {
      const response = await firstValueFrom(
        this.http.get(url, { params: { api_key: this.apiKey, ...filters } }),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(`error at tmdp gateway: ${error.message}`);
    }
  }

  async getMovieById(id: number): Promise<any> {
    const url = `${this.baseUrl}/movie/${id}`;
    console.log(url);
    try {
      const response = await firstValueFrom(
        this.http.get(url, { params: { api_key: this.apiKey } }),
      );
      const movie = response.data;
      return movie;
    } catch (error) {
      throw new BadRequestException(`error at tmdp gateway: ${error.message}`);
    }
  }

  convertGenresIdsToNames(genreIds: number[]): string[] {
    return genreIds.map((genreId) => {
      const genre = this.genres.genres.find((g) => g.id === genreId);
      return genre.name;
    });
  }
}
