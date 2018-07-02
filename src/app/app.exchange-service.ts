import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable()
export class ExchangeService {

  constructor(private http: HttpClient) {
  }

  // API: GET /getAllCountries
  public getAllCountries() {
    // will use this.http.get()
    return this.http.get(environment.countryBaseUrl + 'all')
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  public getExachangeRate(fromToCurrencyCode) {
    // will use this.http.get() EUR_USD
    return this.http.get(environment.currencyConverterBaseUrl + fromToCurrencyCode)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      'Something bad happened; please try again later.');
  }
}
