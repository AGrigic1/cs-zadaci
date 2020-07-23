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

  public getSchedule(): any {
    const scheduleObservable = new Observable(observer => {
      setTimeout(() => {
        observer.next(this.getAppointment);
      }, 1000);
    });
    return scheduleObservable;
  }

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

  // postAppointment(appointments: Appointment): Observable<any> {
  //   const headers = { 'content-type': 'application/json'}
  //   const body = JSON.stringfy(appointment):
  //   console.log(body)
  //   return this._http.post("https://localhost:44308/api/Appointment", body,{'headers': headers})
  // }


  // putAppointment(appointments: Appointment): Observable<Appointment> {
  //   return this._http.put<Appointment>("https://localhost:44308/api/Appointment", appointments, {
  //     headers: new HttpHeaders({
  //       'Authorization': 'my-auth-token'
  //     })
  //   })
  // }

} 
