import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UnsplashContactorService } from './services/unsplash-contactor.service';
import { WeatherContactorService, WeatherData } from './services/weather-contactor.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  completeData: CompleteData;
  form: FormGroup;
  control: AbstractControl;
  currentlyShowingData: boolean = false;
  previousFormValue = '';

  sub$sb: Subscription;
  errorString: string = '';
  constructor(public fb: FormBuilder, public wC: WeatherContactorService, public uC: UnsplashContactorService) {
    this.form = this.fb.group({});
    this.control = new FormControl('', { validators: [Validators.required] });
    this.form.controls.cityName = this.control;
    this.control.updateOn;
    this.completeData = {
      weatherData: {
        city: '',
        coords: { lat: 0, lon: 0 },
        country: '',
        weatherDesc: '',
        humidity: 0,
        localDateTime: '',
        remoteDateTime: '',
        temperature: 0,
      },
      imageUrl: '../assets/home/background.jpg',
    };
    this.sub$sb = this.control.valueChanges
      .pipe(
        tap((val) => {
          if (this.previousFormValue === this.control.value) {
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
        this.completeData.weatherData = await this.wC.getWeatherData(this.control.value);
        //this.completeData.weatherData = await this.wC.testGetWeatherData('');
        this.previousFormValue = this.control.value;
        this.completeData.imageUrl = await this.uC.getSinglePictureURL(this.completeData.weatherData.weatherDesc);
        //this.completeData.imageUrl = await this.uC.testGetSinglePictureURL(this.completeData.weatherData.weatherDesc);
        this.control.markAsPristine();

        console.log('called api');
      }
      this.errorString = '';
      this.setCurrentlyShowingData(true);
    } catch (error) {
      console.log('Error occured trying to contact API.', error);
      this.errorString = `Failure occured while fetching weather data for "${this.control.value}". Please try formating your input as "<city>[,<country>]".For example, "rome, italy"`;
    }
  }
  getImageURL() {
    if (this.currentlyShowingData) {
      return `url(${this.completeData.imageUrl})`;
    } else {
      return 'url(../assets/home/background.jpg)';
    }
  }
  convert2F(temp: number) {
    return ((9 / 5) * temp + 32).toFixed(1);
  }
  weatherDataEmpty() {
    return this.completeData.weatherData.city === ''; //temp quickcheck
  }
}
export interface CompleteData {
  weatherData: WeatherData;
  imageUrl: string;
}
