import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Record } from './shared/record';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  // baseUrl = 'http://localhost:8080';
  baseUrl = 'https://screen-scraper.herokuapp.com';

  constructor(private http: HttpClient) { }
  // Http Headers
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // };

  public GerRecords(zip: string, jurisdiction: string, miles: string): Observable<Record[]> {
    if (zip != null && jurisdiction != null) {
      return this.http
        .get<Record[]>(this.baseUrl + `/screenscraper?zip=${zip}&jurisdiction=${jurisdiction}&miles=${miles}`)
        .pipe(retry(1), catchError(this.errorHandl));
    } else if (zip != null) {
      return this.http
        .get<Record[]>(this.baseUrl + `/screenscraper?zip=${zip}&miles=${miles}`)
    } else if (jurisdiction != null) {
      return this.http
        .get<Record[]>(this.baseUrl + `/screenscraper?jurisdiction=${jurisdiction}`)
    }
    return this.http
          .get<Record[]>(this.baseUrl + '/screenscraper')
          .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
