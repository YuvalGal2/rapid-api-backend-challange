import {CACHE_MANAGER, Controller, Get, HttpService, Inject, Req} from '@nestjs/common';
import { Request } from 'express';
import {MovieService} from "../../services/movie/movie.service";
import { pipe } from 'rxjs';
import {Movie} from "../../models/movie.model";
@Controller()
export class MovieController {
    constructor(private movieService: MovieService) {}

    // actually we can save this by directly calling the api via the frontend but
    // i will use this backend to save time, i will cache it :)
    @Get('movies')
    async findAllByTitle(@Req() request: Request) {
        const movieTitle: any = request.query.title ?? '';
        const results = await this.movieService.findAllByTitle(movieTitle).pipe().toPromise();
        const checkedResults = this.handleResultsNotFound(results);
        return await this.movieService.setSearchedValueInCache('search', movieTitle, checkedResults.data);
    }
    @Get('movie?:imdbId')
    async findMovieById(@Req() request: Request) {
        const imdbId: any = request.query.imdbId ?? '';
        const results = await this.movieService.findDetailsById(imdbId).pipe().toPromise();
        return await this.movieService.setSearchedValueInCache('movie-details', imdbId, results.data);
    }

    // make sure the frontend won't case of "Error with not results"
    private handleResultsNotFound(results) {
        if (!results.data.Search) {
           results.data.Search = [];
        }
        return results;
    }
}

