import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Album } from './album';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private apiURL = 'https://jsonplaceholder.typicode.com/albums';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Album[]> {
    return this.httpClient.get<Album[]>(this.apiURL).pipe(catchError(this.errorHandler));
  }

  create(album: Album): Observable<Album> {
    return this.httpClient
      .post<Album>(this.apiURL, JSON.stringify(album), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  find(id: number): Observable<Album> {
    return this.httpClient.get<Album>(this.apiURL + '/' + id).pipe(catchError(this.errorHandler));
  }

  update(id: number, album: Album): Observable<Album> {
    return this.httpClient
      .put<Album>(this.apiURL + '/' + id, JSON.stringify(album), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  delete(id: number) {
    return this.httpClient
      .delete<Album>(this.apiURL + '/' + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
