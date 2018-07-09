import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError} from 'rxjs';
import { of } from 'rxjs';
import { environment } from './../environments/environment';
import {ExchangeService} from './app.exchange-service';
declare var require: any;

@Injectable()
export class MockExchangeService {
  public mockName: any = 'Mocked Exchange Service';

  data: any = require('../assets/country-mock.json');
  exchangeRateData: any = require('../assets/currency-exchange-mock.json');

  getAllCountries(): Observable<any[]> {
    return of(this.data);
  }

  getExachangeRate(): Observable<any[]> {
    return of(this.exchangeRateData);
  }
}


