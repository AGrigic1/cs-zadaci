import { Injectable, Pipe } from '@angular/core';
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
  
  url = "https://localhost:44308/api";

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

  //  postAppointment(appointments: Appointment): Observable<Appointment> {
  //    return this._http.postAppointment("https://localhost:44308/api/Appointment", appointments).pipe(
  //      map( response => {
  //          return new Appointment().deserialize(response);
  //        }
  //      )
  //    );
  //  }

  public getSchedule(): any {
    const scheduleObservable = new Observable(observer => {
      setTimeout(() => {
        observer.next(this.appointments);
      }, 1000);
    });
    return scheduleObservable;
  }
  // putAppointment(appointments: Appointment): Observable<Appointment> {
  //   return this._http.put<Appointment>("https://localhost:44308/api/Appointment", appointments, {
  //     headers: new HttpHeaders({
  //       'Authorization': 'my-auth-token'
  //     })
  //   })
  // }

} 
