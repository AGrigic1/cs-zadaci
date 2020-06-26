import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import { Patient } from '../calendar/patient';
import { Doctor } from '../calendar/doctor';
import { Appointment } from '../calendar/appointment';
import { Http, Response, Headers } from '@angular/http';

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

  // postAppointment(appointments: Appointment): Observable<Appointment> {
  //   return this._http.post<Appointment>("https://localhost:44308/api/Appointment", appointments, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   })
  // }

  putAppointment(appointments: Appointment): Observable<Appointment> {
    return this._http.put<Appointment>("https://localhost:44308/api/Appointment", appointments, {
      headers: new HttpHeaders({
        'Authorization': 'my-auth-token'
      })
    })
  }

} 
