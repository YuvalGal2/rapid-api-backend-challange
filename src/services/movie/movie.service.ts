import {
  CACHE_MANAGER,
  Controller,
  Get,
  HttpService,
  Inject,
  Injectable,
  Req,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class MovieService {
    constructor(
        @Inject(CACHE_MANAGER) protected readonly cacheManager,
        private _http: HttpService,) {}

    private getKeyFromCache(key: string,value: string) {
        return this.cacheManager.get(`${key}-${value}`);
    }
    async setSearchedValueInCache(key:string, value: string, data) {
        return await this.cacheManager.set(`${key}-${value}`, data);
    }

    private findByData(data: string, queryParamName: string, cacheKey: string): Observable<any> {
        let searchInCache = null;
        // check if the input supplied by the user valid
        if (data.length === 0) {
            return of([]);
        }
        this.getKeyFromCache(cacheKey,data).then((response) => {
            searchInCache = response;
        });

        if (!searchInCache || searchInCache === undefined) {
            return this._http.get(`${process.env.moviesDataAPI}?${queryParamName}=${data}&apikey=${process.env.APIKey}`)
        }
        return of(searchInCache);
    }
    findDetailsById(imdbId: string): Observable<any> {
        return this.findByData(imdbId,'i','movie-details')
    }

    findAllByTitle(movieTitle: string): Observable<any> {
       return this.findByData(movieTitle,'s','search')
  }
}
