
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ExchangeService} from './app.exchange-service';
import {HttpClient} from '@angular/common/http';

describe('ExchangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExchangeService]
    });
  });
  it(`should expect a GET Country https://restcountries.eu/rest/v2/all`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('https://restcountries.eu/rest/v2/all').subscribe();
      backend.expectOne({
        url: 'https://restcountries.eu/rest/v2/all',
        method: 'GET'
      });
    })));
  it(`should expect a GET Exchange Rate http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=`,
    async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      http.get('http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=').subscribe();
      backend.expectOne({
        url: 'http://free.currencyconverterapi.com/api/v5/convert?compact=y&q=',
        method: 'GET'
      });
    })));
});
