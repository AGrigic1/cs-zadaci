import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n } from '@syncfusion/ej2-base';
import { View, EventSettingsModel, DragEventArgs, ResizeEventArgs, ScheduleComponent, CellClickEventArgs, ActionEventArgs, GroupModel } from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { Http, Response } from '@angular/http';
import { DataManager, WebApiAdaptor, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import 'rxjs/add/operator/map';
import { RepositoryService } from '../service/repository.service';
import { Patient } from './patient';
import { Doctor } from './doctor';
import { Appointment } from './appointment';

L10n.load({
  'en-US': {
    'schedule': {
      'title': 'Ime događaja',
      'day': 'Dan',
      'week': 'Tjedan',
      'workWeek': 'Radni tjedan',
      'month': 'Mjesec',
      'today': 'Danas',
      'saveButton': 'Dodaj',
      'cancleButton': 'Zatvori',
      'deleteButton': 'Ukloni',
      'newEvent': 'Dodaj događaj',
      'deleteEvent': 'Obriši događaj',
      'delete': 'Obriši',
      'deleteMultipleEvent': 'Obriši više događaja!',
      'edit': 'Uredi',
      'editSeries': 'Uredi seriju',
      'editEvent': 'Uredi događaj',
      'editContent': 'Želite li urediti ovaj događaj ili cijelu seriju?',
      'deleteRecurrenceContent': 'Želite li obrisati samo ovaj događaj ili seriju seriju?',
      'deleteContent': 'Jeste li sigurni da želite obrisati ovaj događaj',
      'deleteMultipleContent': 'Jeste li sigurni da želite obrisati selektirane događaje?',
    }
  }
});

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [RepositoryService]
})
export class CalendarComponent implements OnInit {
  title = 'Kalednar333';

  @ViewChild('sheduleObj')
  public scheduleInstance: ScheduleComponent;
  @ViewChild('treeObj')
  public treeObj: TreeViewComponent;

  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];

  constructor(private _repositoryService: RepositoryService){
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log(this.doctors));
  }
  

  async ngOnInit(){
    this._repositoryService.getPatient()
      .subscribe((patientData) => {
        console.log(patientData);
        this.patients = patientData;
      })

    this._repositoryService.getDoctor()
      .subscribe((doctorData) => {
        console.log(doctorData);
        this.doctors = doctorData;
      })

    this._repositoryService.getAppointment()
      .subscribe((appointmentData) => {
        console.log(appointmentData);
        this.appointments = appointmentData;
      })
  }

  public allowMultiplePac: Boolean = true;
  public allowEditing: boolean = true;
  public group: GroupModel = {
    resources: ['Doktori', 'Pacijenti']
  };

  public setView: View = 'Month'; //postavljanje početnog pogleda na kalendar, izmjena izmedu Day, Week, WorkWeek, Month, Agenda
  public setDate: Date = new Date(2020,4,28); //postavljanje datuma po želji
  public dateFormat: string = "dd/MM/yyyy";
  public views: Array<string> = ['Day','Week','WorkWeek','Month'];

  public DocDataSource: Object[] = [
    { name: "Ivica", id: 1},
    { name: "Perica", id: 2}
  ];
  public PacDataSource: Object[] = [
    { name: "Marica", id: 1, PacGroupId: 1 },
    { name: "Ivana", id: 2, PacGroupId: 2 },
    { name: "Klara", id: 3, PacGroupId: 1 }
  ];

  public eventObject: EventSettingsModel = {
    dataSource: 
    [{
      Id: 1,
      StartTime: new Date(2020,4,25,10,0), //rucno postavljanje eventa
      EndTime: new Date(2020,4,25,12,0),
      PacGroupId: 2
    },
    {
      Id: 2,
      Subject: "Testing2",
      StartTime: new Date(2020,4,28,10,0),
      EndTime: new Date(2020,4,28,12,0),
      Location: "Krov"
    }
    ], 
    /*fields: {
      subject: { name: 'Subject', default: "Pozdrav" }
    }*/
  }

  onTreeDragStop(args: DragAndDropEventArgs): void {
    let cellData: CellClickEventArgs = this.scheduleInstance.getCellDetails(args.target);
    let eventData: { [key: string]: Object } = {
      Subject: args.draggedNodeData.text,
      StartTime: cellData.startTime,
      EndTime: cellData.endTime,
      IsAllDay: cellData.isAllDay
    };
    this.scheduleInstance.addEvent(eventData);
  }

  onDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
  }
  
  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
  }

    // POZIVANJE WEB API-A

    // public data: Object = new DataManager({
    //   url: 'https://localhost:44308/api',
    //   adaptor: new ODataV4Adaptor,
    //   crossDomain: true,
    // });
  
    // public query:Object = new Query().from('Patient').select('Id,Name,Surname,Email');
    // public field:Object = { dataSource:this.data, query: this.query, id: 'Id', text: 'Name' };
  
    // public query1:Object = new Query().from('Doctor').select('Id,Name,Surname');
    // public field1:Object = { dataSource:this.data, query1: this.query, id: 'Id', text: 'Name'};
  
    // private Url = 'https://localhost:44308/api/Patient';
    // data1: any = {};
  
    // constructor(private http: Http) {
    //   this.getContacts();
    //   this.getData();
    // }
  
    // getData() {
    //   return this.http.get(this.Url)
    //     .map((res: Response) => res.json())
    // }
  
    // getContacts() {
    //   this.getData().subscribe(data1 => {
    //     console.log(data1);
    //     this.data1 = data1
    //   })
    // }

}
