import { Component, OnInit} from '@angular/core';
import { ExchangeService } from './app.exchange-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  countries: {currencyName: string, currencyCode: string, currencySymbol: string}[] = [];

  fromCurrency = {currencyCode: '', currencySymbol: ''};
  toCurrency = {currencyCode: '', currencySymbol: ''};
  fromValue = 0.0;
  toValue = 0.0;
  exchangeRate = 0.0;
  toStr = JSON.stringify;

  sorters = {
    byCurrencyName : function(a,b) {
      return ((a.currencyName < b.currencyName) ? -1 : ((a.currencyName > b.currencyName) ? 1 : 0));
    }
  };


  constructor(private exchangeService: ExchangeService) { }

  ngOnInit(): void {
    this.getAllCountries();
  }

  getAllCountries(): void {
    this.exchangeService.getAllCountries()
      .subscribe((data: any) => {
          console.log('success', data);
          // this.results = data.results;
          data.forEach(country => {
            this.countries.push({currencyName: country.currencies[0].name, currencyCode: country.currencies[0].code, currencySymbol: country.currencies[0].symbol });
          });

          this.countries = this.removeDuplicates(this.countries, 'currencyCode');

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getExachangeRate(): void {
    const fromToCurrencyCode = this.fromCurrency.currencyCode + '_' + this.toCurrency.currencyCode;
    this.exchangeService.getExachangeRate(fromToCurrencyCode)
      .subscribe((data: any) => {
          this.exchangeRate = data[fromToCurrencyCode].val;
          this.toValue = this.fromValue * this.exchangeRate;
        },
        (error: any) => {
          console.log('error', error);
        });
  }


  fromCountryChangeHandler (event: any) {

    const toCurrency =  JSON.parse(event.target.value);
    this.fromCurrency.currencySymbol = toCurrency.currencySymbol;
    this.fromCurrency.currencyCode = toCurrency.currencyCode;

    if (this.shouldUpdateExchangeRate()) {
      this.getExachangeRate();
    }
  }

  toCountryChangeHandler (event: any) {
    // update the ui
    const fromCurrency =  JSON.parse(event.target.value);
    this.toCurrency.currencySymbol = fromCurrency.currencySymbol;
    this.toCurrency.currencyCode = fromCurrency.currencyCode;

    if (this.shouldUpdateExchangeRate()) {
      this.getExachangeRate();
    }
  }

  shouldUpdateExchangeRate() {
    return (this.fromValue > 0 || this.toValue > 0) && (this.fromCurrency.currencyCode != null && this.toCurrency.currencyCode);
  }

  onToChange(event: any) {

    if (this.exchangeRate === 0 && this.shouldUpdateExchangeRate()) {
      this.getExachangeRate();
    }

    this.fromValue = this.toValue * this.exchangeRate;
  }

  onFromChange(event: any) {

    if (this.exchangeRate === 0 && this.shouldUpdateExchangeRate()) {
      this.getExachangeRate();
    }

    this.toValue = this.fromValue * this.exchangeRate;

  }

  removeDuplicates(currencies, prop) {
    return this.countries.sort(this.sorters.byCurrencyName).filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }


}
