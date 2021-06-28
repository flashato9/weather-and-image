import { Injectable } from '@angular/core';
import { getCountryName } from '../utility-functions/getCountryName';
import { getTimezoneDateString } from '../utility-functions/getTimeZoneDateString';

@Injectable({
  providedIn: 'root',
})
export class WeatherContactorService {
  private apiKey = '796468292ae1e7ee17f39c2006913d91';
  private units = 'metric';
  constructor() {}
  async getWeatherData(cityName: string) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${this.units}&appid=${this.apiKey}`;
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      const countryName = await getCountryName(<string>data.sys.country);
      const timezoneOffset = data.timezone * 1000;
      const localDate = new Date();
      const localDateString = getTimezoneDateString(localDate, localDate.getTimezoneOffset() * -1 * 60 * 1000);
      const remoteDateString = getTimezoneDateString(localDate, timezoneOffset);

      const weatherData: WeatherData = {
        weatherDesc: <string>data.weather[0].description,
        country: countryName,
        city: <string>data.name,
        coords: <{ lat: number; lon: number }>data.coord,
        localDateTime: localDateString,
        remoteDateTime: remoteDateString,
        temperature: <number>data.main.temp,
        humidity: <number>data.main.humidity,
      };

      return weatherData;
    } catch (error) {
      throw error;
    }
  }
  async testGetWeatherData(cityName: string) {
    const weatherData: WeatherData = {
      weatherDesc: 'clear skies',
      country: 'Canada',
      city: <string>'Toronto',
      coords: { lat: 43, lon: 71 },
      localDateTime: '14:02:23',
      remoteDateTime: '14:02:23',
      temperature: 24.3,
      humidity: 52,
    };
    return weatherData;
  }
}
export interface WeatherData {
  weatherDesc: string;
  country: string;
  city: string;
  coords: { lat: number; lon: number };
  localDateTime: string;
  remoteDateTime: string;
  temperature: number;
  humidity: number;
}
