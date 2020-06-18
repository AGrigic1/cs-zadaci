import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Patient } from '../calendar/patient';
import { Doctor } from '../calendar/doctor';
import { Appointment } from '../calendar/appointment';
import { Http, Response } from '@angular/http';

@Injectable()
export class RepositoryService {

  constructor(private _http: Http){

  }

  getPatient(): Observable<Patient[]> {
    return this._http.get("https://localhost:44308/api/Patient")
      .map((response: Response ) => <Patient[]>response.json())
  }

  getDoctor(): Observable<Doctor[]> {
    return this._http.get("https://localhost:44308/api/Doctor")
      .map((response: Response ) => <Doctor[]>response.json())
  }

  getAppointment(): Observable<Appointment[]> {
    return this._http.get("https://localhost:44308/api/Appointment")
      .map((response: Response ) => <Appointment[]>response.json())
  }

} 
