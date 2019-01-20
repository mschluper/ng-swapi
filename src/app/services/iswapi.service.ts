import { Observable } from 'rxjs';
import { Planet } from '../DTOs/planet';
import { PagedResponse } from '../DTOs/planetsResponse';

export interface ISwapiService {
    getFirstPageOfThings<T>(urlExtension: string, page: number) : Observable<PagedResponse<T>>;
    getAllThings<T>(urlExtension: string) : Observable<T>;
    getAllThingsInChunks<T>(urlExtension: string) : Observable<T[]>;
    getPlanet(id: number): Observable<Planet>;
    savePlanet(planet: Planet): Observable<number>;
}

export interface ICachedSwapiService extends ISwapiService {};