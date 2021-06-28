import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UnsplashContactorService {
  private apiKey = 'IHR5-jk0wKFJbtBjaeb4CbkjS-0S_A3QEXt81x7bclY';
  constructor() {}
  async getSinglePictureURL(imageDescription: string) {
    const url = `https://api.unsplash.com/search/photos?client_id=${this.apiKey}&query=${imageDescription}`;
    try {
      const response = await fetch(url);
      const data: any = await response.json();
      const imageDatas: ImageMetaData[] = (<any[]>data.results).map((data) => {
        const metaData: ImageMetaData = { regularUrl: data.urls.regular, likes: data.likes };
        return metaData;
      });
      const numb = Math.floor(Math.random() * imageDatas.length) + 1;
      return imageDatas[numb].regularUrl;
    } catch (error) {
      throw error;
    }
  }
  async testGetSinglePictureURL(imageDescription: string) {
    try {
      return '../assets/home/background.jpg';
    } catch (error) {
      throw error;
    }
  }
}

export interface ImageMetaData {
  regularUrl: string;
  likes: number;
}
