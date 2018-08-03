import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

import { Observable, Subscription, timer } from 'rxjs';
import { MapData } from './mapLocator/mapData';
import { MapCenter } from './mapLocator/mapCenter';
import { MapLocation } from './mapLocator/mapLocation';
import { MapLocatorService } from './mapLocator/mapLocator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ MapLocatorService ],
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  mapData: MapData[];
  mapLocations: MapLocation[];
  latitude: string;
  longitude: string;
  workLastUpdated: string;
  title = 'Mobile Command Center Map';
  //iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  
  private timerSubscription: Subscription;
  private workSubscription: Subscription;
  private markers: google.maps.Marker[];

  constructor(private mapLocatorService: MapLocatorService) {}

  ngOnInit() {
    this.workLastUpdated = '';
    this.mapLocatorService.getStartUp().subscribe((mapData: MapData[]) => {
      this.createMap(mapData);
      this.refreshData();
    });
  }

  public ngOnDestroy(): void {
    if(this.workSubscription) {
      this.workSubscription.unsubscribe();
    }
  }

  private refreshData(): void {
    this.workSubscription = this.mapLocatorService.getNewWork(this.workLastUpdated).subscribe((mapData: MapData[]) => {
       if(mapData.length != 0) { this.updateMap(mapData); }
      this.subscribeToData();
    });
  }

  private subscribeToData(): void {
    this.timerSubscription = timer(5000).subscribe(() => this.refreshData());
  }

  private createMap(mapData: MapData[]) {
    var mapProp = {
      center: new google.maps.LatLng(
        Number(mapData[0].mapCenter.txLatitude), 
        Number(mapData[0].mapCenter.txLongitude)
      ),
      zoom: mapData[0].mapCenter.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if(this.map == null) {
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    }

    for (let ml of mapData[0].mapLocations) {
      if (this.workLastUpdated == '') {
        this.workLastUpdated = ml.updatedAt;
      } else {
        if(this.workLastUpdated < ml.updatedAt) {
          this.workLastUpdated = ml.updatedAt;
        }
      }

      let location = new google.maps.LatLng(Number(ml.txLatitude), Number(ml.txLongitude));
        
      let marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: ml.txWorkType
      });  
    }
  }

  private updateMap(mapData: MapData[]) {
    for (let ml of mapData[0].mapLocations) {
      if (this.workLastUpdated == '') {
        this.workLastUpdated = ml.updatedAt;
      } else {
        if(this.workLastUpdated < ml.updatedAt) {
          this.workLastUpdated = ml.updatedAt;
        }
      }

      let location = new google.maps.LatLng(Number(ml.txLatitude), Number(ml.txLongitude));
        
      let marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: ml.txWorkType
      });
      //this.markers.push(marker);
      marker.setMap(this.map);
    }
  }
}