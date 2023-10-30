import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http' 
import { BehaviorSubject, Observable } from 'rxjs';
import { UnitsResponse } from '../types/units-reponse.interface';
import { Location } from '../types/location.interface';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetUnitsService {
  readonly apiUrl = "https://test-frontend-developer.s3.amazonaws.com/data/locations.json";
  readonly apiUrlBackup = "./assets/data/locations.json";

  
  private allUnitsSubject: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);
  private allUnit$: Observable<Location[]> = this.allUnitsSubject.asObservable();
  private filteredUnits: Location[] = [];

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<UnitsResponse>(this.apiUrl)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Erro na requisição:', error);
        return this.httpClient.get<UnitsResponse>(this.apiUrlBackup);
      })
    )
    .subscribe( data => {
      this.allUnitsSubject.next(data.locations);
      this.filteredUnits = data.locations;
    });
   }
  
  getAllUnits(): Observable<Location[]>{
    return this.allUnit$;
  }

  getFilteredUnits(){
    return this.filteredUnits
  }

  setFilteredUnit(value: Location[]){
    this.filteredUnits = value;
  }

}
