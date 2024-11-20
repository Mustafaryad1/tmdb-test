/* eslint-disable @typescript-eslint/naming-convention */
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
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

  async getMovies(): Promise<any> {
    const url = `${this.baseUrl}/movie/popular`;

    try {
      const response = await firstValueFrom(
        this.http.get(url, { params: { api_key: this.apiKey } }),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(`error at tmdp gateway: ${error.message}`);
    }
  }
}
