import { Planet } from './planet';

export class PlanetsResponse {
    count: number;
    next: string;
    previous: string;
    results: Planet[];
}

export class PagedResponse<T> {
    count: number;
    next: string;
    previous: string;
    results: T[];
}