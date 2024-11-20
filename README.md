
# TMDB CRUD Application

This project is a CRUD application built with [NestJS](https://nestjs.com/) that interacts with [The Movie Database (TMDB)](https://www.themoviedb.org/) API, utilizing Prisma ORM for database operations. The app can be run locally or via Docker Compose.

---

## Prerequisites

Ensure the following tools are installed for manual installation:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (for local development)
---

Or using Docker 
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)


## Environment Variables

Create a `.env` file in the root of the project with the following contents:

```env
# Port
PORT=8080

# TMDB API
TMDB_API_KEY=your_tmdb_api_key
TMDP_BASE_URL=https://api.themoviedb.org/3

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=tmdb
POSTGRES_PORT=5432
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}

# X-API-KEY
X_API_KEY=your_x_api_key // To access protected endpoints
```

---

## Running Locally

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start PostgreSQL**

   Ensure PostgreSQL is running locally. Update `.env` with your local database credentials if different.

3. **Run Prisma Migrations**

   ```bash
   npx prisma migrate dev
   ```

4. **Start the Application**

   ```bash
   npm run start:dev
   ```

5. The application will be available at `http://localhost:8080`.

---

## Running with Docker Compose

1. **Set up the `.env` file**

   Ensure the `.env` file has the correct `DATABASE_URL` for the Docker Compose setup:

   ```env
   DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres_db:5432/${POSTGRES_DB}
   ```

2. **Build and Start Services**

   ```bash
   docker-compose up --build
   ```

3. **Access the Application**

   - App: `http://localhost:8080`
   - PostgreSQL will run inside the container.


## Project Structure

```
prisma/
src/
├── app.module.ts         # Root module
├── main.ts               # Entry point
└── movies/               # movies module
└── common/               # common module

```

---

## Useful Commands

### Prisma

- **Generate Prisma Client**: `npx prisma generate`
- **Apply Migrations**: `npx prisma migrate dev`
- **Access Database (via Prisma Studio)**: `npx prisma studio`

### Docker

- **Stop and Remove Containers**: `docker-compose down`
- **Rebuild and Restart Containers**: `docker-compose up --build`

---

## API Endpoints

The application exposes CRUD operations for interacting with movies. Authentication is required via `X-API-KEY`.

- **Base URL**: `http://localhost:8080`

Example Endpoints:

- `GET /movies` - Fetch all movies
- `POST /movies` - Add a new movie
- `PUT /movies/:id` - Update a movie
- `DELETE /movies/:id` - Delete a movie

---

## License

MIT License
