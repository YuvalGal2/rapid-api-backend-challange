import {
  CACHE_MANAGER,
  Controller,
  Get,
  HttpService,
  Inject,
  Injectable,
  Req,
} from '@nestjs/common';
import {Observable, of} from "rxjs";

@Injectable()
export class MovieService {
    constructor(
        @Inject(CACHE_MANAGER) protected readonly cacheManager,
        private _http: HttpService,) {}


     getKeyFromCache(key: string,value: string) {
        return this.cacheManager.get(`${key}-${value}`);
    }
    async setSearchedValueInCache(key:string, value: string, data) {
        return await this.cacheManager.set(`${key}-${value}`, data);
    }

    findDetailsById(imdbId: string): Observable<any> {
        let searchInCache = null;
        // check if the input supplied by the user valid
        if (imdbId.length === 0) {
            return of({});
        }
        this.getKeyFromCache('movie-details',imdbId).then((response) => {
            searchInCache = response;
        });

        if (!searchInCache || searchInCache === undefined) {
            return this._http.get(`${process.env.moviesDataAPI}?i=${imdbId}&apikey=${process.env.APIKey}`)
        }
        return of(searchInCache);
    }

    findAllByTitle(movieTitle: string): Observable<any> {
        let searchInCache = null;
        // check if the input supplied by the user valid
        if (movieTitle.length === 0) {
            return of([]);
        }
        this.getKeyFromCache('search',movieTitle).then((response) => {
            searchInCache = response;
        });

        if (!searchInCache || searchInCache === undefined) {
            return this._http.get(`${process.env.moviesDataAPI}?s=${movieTitle}&apikey=${process.env.APIKey}`)
        }
        return of(searchInCache);
  }
}
