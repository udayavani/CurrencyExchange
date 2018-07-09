import {TestBed, async, ComponentFixture, tick, fakeAsync} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {ExchangeService} from './app.exchange-service';
import {HttpClientModule} from '@angular/common/http';
import {DebugElement, inject} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MockExchangeService} from './app.mock-exchange-service';


let comp:    AppComponent;
let fixture: ComponentFixture<AppComponent>;
let exchangeService: ExchangeService;
let de: DebugElement;
let element: HTMLElement;
let getAllCountries;
let getExachangeRate;
let shouldUpdateExchangeRate;
let ngOnInit;
let fromCountryChangeHandler;
let toCountryChangeHandler;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule],
      declarations: [
        AppComponent
      ],
      providers: [
          {provide: ExchangeService, useClass: MockExchangeService}
        ]
    }).compileComponents();
  }));
  tests();
});

function tests() {
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    exchangeService = TestBed.get(ExchangeService);
    getAllCountries = spyOn(exchangeService, 'getAllCountries').and.callThrough();
    getExachangeRate = spyOn(exchangeService, 'getExachangeRate').and.callThrough();
    shouldUpdateExchangeRate = spyOn(comp, 'shouldUpdateExchangeRate').and.callThrough();
    fromCountryChangeHandler = spyOn(comp, 'fromCountryChangeHandler').and.callThrough();
    toCountryChangeHandler = spyOn(comp, 'toCountryChangeHandler').and.callThrough();
    ngOnInit = spyOn(comp, 'ngOnInit').and.callThrough();
  });

  it('should create the Exchange App', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have exchangeService Injected', function() {
    expect(exchangeService).toBeTruthy();
  });

  it('should have a form, select and input to display fields', () => {
    de = fixture.debugElement.query(By.css('div'));
    element  = de.nativeElement;
    expect(element.innerHTML).toContain('form');
    expect(element.innerHTML).toContain('select');
    expect(element.innerHTML).toContain('input');
  });

  function sendInput(inputElement: any, text: string) {
    inputElement.value = text;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return fixture.whenStable();
  }

  it('should trigger event onFromChange', async() => {
    fixture.detectChanges();
    fixture.whenStable();
    spyOn(comp, 'onFromChange').and.callThrough();
    de = fixture.debugElement.query(By.css('.from-amount'));
    element  = de.nativeElement;

    sendInput(element, '5')
      .then(() => {
        de.triggerEventHandler('onChange', null);
      fixture.detectChanges();
      expect(comp.onFromChange).toHaveBeenCalledTimes(1);
    });
  });

  it('should trigger event onToChange', async() => {
    // Because this is in an async wrapper it will automatically wait
    // for the call to whenStable() to complete
    fixture.detectChanges();
    fixture.whenStable();
    spyOn(comp, 'onToChange').and.callThrough();
    de = fixture.debugElement.query(By.css('.to-amount'));
    element  = de.nativeElement;

    sendInput(element, '5')
      .then(() => {
        de.triggerEventHandler('onChange', null);
        fixture.detectChanges();
        expect(comp.onToChange).toHaveBeenCalledTimes(1);
      });
  });

  it(
    `Exchange App should be initialized`, () => {
    expect(fixture).toBeDefined();
    expect(comp).toBeDefined();
  });

  it(`should call getAllCountries`, () => {
    fixture.detectChanges();
    expect(ngOnInit).toHaveBeenCalled();
    expect(getAllCountries).toHaveBeenCalledTimes(1);
  });

  it(`should remove duplicates`, () => {
    expect(comp.countries.length).toEqual(0);
     comp.getAllCountries();
     expect(comp.countries.length).toEqual(2);
  });

  it(`should have sorted by currencyName`, () => {
    expect(comp.countries.length).toEqual(0);
    comp.getAllCountries();
    expect(comp.countries[0].currencyCode === 'AOA').toEqual(true);
  });

  it(`should init exchangeRate`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.getExachangeRate();
    expect(comp.exchangeRate).toEqual(1.616908);
  });

  it(`should update to value with conversion`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.fromValue = 5;
    comp.getExachangeRate();
    const expecetdToValue = comp.fromValue * 1.616908;
    expect(comp.toValue).toEqual(expecetdToValue.toFixed(2));
  });

  it(`should update from value with conversion`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 5;
    comp.fromValue = 0;
    comp.getExachangeRate();
    const expecetdToValue = comp.toValue / 1.616908;
    expect(comp.fromValue).toEqual(expecetdToValue.toFixed(2));
  });

  it(`fromCountryChangeHandler - getExachangeRate should have been called`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 5;
    const input = {target: { value: '{"currencyCode": "AFN", "currencySymbol": "A"}'}};
    comp.fromCountryChangeHandler(input);
    expect(getExachangeRate).toHaveBeenCalledTimes(1);
  });

  it(`fromCountryChangeHandler - getExachangeRate should not been called`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 0;
    const input = {target: { value: '{"currencyCode": "AFN", "currencySymbol": "A"}'}};
    comp.fromCountryChangeHandler(input);
    expect(getExachangeRate).toHaveBeenCalledTimes(0);
  });

  it(`toCountryChangeHandler - getExachangeRate should have been called`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 5;
    const input = {target: { value: '{"currencyCode": "DZD", "currencySymbol": "D"}'}};
    comp.toCountryChangeHandler(input);
    expect(getExachangeRate).toHaveBeenCalledTimes(1);
  });

  it(`toCountryChangeHandler - getExachangeRate should not been called`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 0;
    const input = {target: { value: '{"currencyCode": "DZD", "currencySymbol": "D"}'}};
    comp.toCountryChangeHandler(input);
    expect(getExachangeRate).toHaveBeenCalledTimes(0);
  });

  it(`onFromChange - toValue not updated`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.fromValue = 5;
    comp.exchangeRate = 1.616908;
    const expecetdToValue = comp.fromValue * comp.exchangeRate;
    const event = {target: { value: '{"currencyCode": "DZD", "currencySymbol": "D"}'}};
    comp.onFromChange(event);
    expect(comp.toValue).toEqual(expecetdToValue.toFixed(2));
  });

  it(`onFromChange - getExchangeRate not invoked`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.fromValue = 5;
    comp.exchangeRate = 0;
    const expecetdToValue = comp.fromValue * comp.exchangeRate;
    const event = {target: { value: '{"currencyCode": "DZD", "currencySymbol": "D"}'}};
    comp.onFromChange(event);
    expect(getExachangeRate).toHaveBeenCalledTimes(1);
  });

  it(`onToChange - fromValue not updated`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 5;
    comp.exchangeRate = 1.616908;
    const expecetdToValue = comp.toValue / comp.exchangeRate;
    const event = {target: { value: '{"currencyCode": "DZD", "currencySymbol": "D"}'}};
    comp.onToChange(event);
    expect(comp.fromValue).toEqual(expecetdToValue.toFixed(2));
  });

  it(`onToChange - getExchangeRate not invoked`, () => {
    comp.fromCurrency.currencyCode = 'AFN';
    comp.toCurrency.currencyCode = 'DZD';
    comp.toValue = 5;
    comp.exchangeRate = 0;
    const expecetdToValue = comp.toValue / comp.exchangeRate;
    const event = {target: { value: '{"currencyCode": "DZD", "currencySymbol": "D"}'}};
    comp.onToChange(event);
    expect(getExachangeRate).toHaveBeenCalledTimes(1);
  });

}

