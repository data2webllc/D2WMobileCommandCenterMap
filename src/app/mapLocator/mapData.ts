import { MapCenter } from './mapCenter';
import { MapLocation } from './mapLocation';

export interface MapData {
    mapCenter: MapCenter;
    mapLocations: MapLocation[];
}