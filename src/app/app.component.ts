import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WeatherContactorService, WeatherData } from './services/weather-contactor.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  weatherData: WeatherData;
  form: FormGroup;
  control: AbstractControl;
  currentlyShowingData: boolean = false;
  previousValue = '';
  sub$sb: Subscription;
  errorString: string = '';
  constructor(public fb: FormBuilder, public wC: WeatherContactorService) {
    this.form = this.fb.group({});
    this.control = new FormControl('', { validators: [Validators.required] });
    this.form.controls.cityName = this.control;
    this.control.updateOn;
    this.weatherData = {
      city: '',
      coords: { lat: 0, lon: 0 },
      country: '',
      weatherDesc: '',
      humidity: 0,
      localDateTime: '',
      remoteDateTime: '',
      temperature: 0,
    };
    this.sub$sb = this.control.valueChanges
      .pipe(
        tap((val) => {
          if (this.previousValue === this.control.value) {
            this.control.markAsPristine();
          }
        })
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.sub$sb.unsubscribe();
  }
  setCurrentlyShowingData(state: boolean) {
    this.currentlyShowingData = state;
  }

  async onButtonClick() {
    if (this.control.valid) {
      const val = this.control.value;
      if (!this.currentlyShowingData) {
        await this.submitForm();
      } else {
        this.setCurrentlyShowingData(false);
      }
    } else {
      console.log('Error, form is not valid.');
    }
  }
  private async submitForm() {
    try {
      if (this.control.dirty) {
        this.weatherData = await this.wC.getWeatherdata(this.control.value);

        this.previousValue = this.control.value;

        this.control.markAsPristine();

        console.log('called api');
      }
      this.errorString = '';
      this.setCurrentlyShowingData(true);
    } catch (error) {
      console.log('Error occured trying to contact API.', error);
      this.errorString = `Failure occured while fetching weather data for "${this.control.value}". Please try again.`;
    }
  }
  convert2F(temp: number) {
    return ((9 / 5) * temp + 32).toFixed(1);
  }
  weatherDataEmpty() {
    return this.weatherData.city === ''; //temp quickcheck
  }
}
