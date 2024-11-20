/* eslint-disable @typescript-eslint/naming-convention */
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FilterPopularMoviesDto } from './dto/filter-popular-movies.dto';
@Injectable()
export class TMDPMovieGateway {
  private apiKey: string;
  private baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get('TMDB_API_KEY');
    this.baseUrl = this.configService.get('TMDP_BASE_URL');
  }

  async getMovies(query: FilterPopularMoviesDto): Promise<any> {
    const url = `${this.baseUrl}/discover/movie`;
    const { page } = query;
    try {
      const response = await firstValueFrom(
        this.http.get(url, { params: { api_key: this.apiKey, page } }),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(`error at tmdp gateway: ${error.message}`);
    }
  }
}
