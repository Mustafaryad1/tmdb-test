import { FilterPopularMoviesDto } from '../dto/filter-popular-movies.dto';

export const filterMovieHelper = (
  query: FilterPopularMoviesDto,
  filters: { [key: string]: any },
  genres: { genres: { id: number; name: string }[] },
) => {
  if (query.genres) {
    const genreIds = query.genres.map((genre) => {
      const foundGenre = genres.genres.find((g) => g.name === genre);
      return foundGenre?.id;
    });

    filters.with_genres = genreIds;
  }

  return filters;
};
