import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MapLocation } from './mapLocation';
import { MapCenter } from './mapCenter';
import { MapData } from './mapData';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class MapLocatorService {
  //serverUrl = "http://localhost:53077/";
  serverUrl = "http://d2wmobile.azurewebsites.net/";
  getWorkUrl = 'api/WorkMasterCurrentWorkList';  // URL to web api
  //getStartUpUrl = 'api/MapStartUp';
  getStartUpUrl = 'api/v1/MapWorkAll';
  getNewWorkUrl = 'api/v1/MapNewWork';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('MapLocatorService');
  }

  /** GET work locations from the server */
  getWorkLocations (): Observable<MapLocation[]> {
    return this.http.get<MapLocation[]>(this.serverUrl + this.getWorkUrl)
      .pipe(
        catchError(this.handleError('getWorkLocations', []))
      );
  }

  /** GET center of map from the server */
  getStartUp (): Observable<MapData[]> {
    return this.http.get<MapData[]>(this.serverUrl + this.getStartUpUrl)

      .pipe(
        catchError(this.handleError('getStatUp', []))
      );
  }

  getNewWork (lastUpdate: string): Observable<MapData[]> {
    return this.http.get<MapData[]>(this.serverUrl + this.getNewWorkUrl + "/" + lastUpdate)
      .pipe(
        catchError(this.handleError('getNewWork', []))
      );
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/