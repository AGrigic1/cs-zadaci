import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n, EmitType, extend } from '@syncfusion/ej2-base';
import { PopupOpenEventArgs, View, EventSettingsModel, DragEventArgs, ResizeEventArgs, ScheduleComponent, CellClickEventArgs, ActionEventArgs, GroupModel, TimelineMonthService  } from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { Http, Response } from '@angular/http';
import { DataManager, WebApiAdaptor, Query, Predicate, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import 'rxjs/add/operator/map';
import { RepositoryService } from '../service/repository.service';
import { Patient } from './patient';
import { Doctor } from './doctor';
import { Appointment } from './appointment';
import * as moment from 'moment';

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
      'location': 'Lokacija',
      'addTitle': 'Dodaj naslov',
      'moreDetails': 'Više detalja',
      'save': 'Spremi',
      'allDay': 'Cijeli dan',
      'start': 'Početak',
      'end': 'Kraj',
      'timezone': 'Vremenska zona',
      'startTimezone': 'Početak vremenske zone',
      'endTimezone': 'Kraj vremenske zone',
      'repeat': 'Ponovi',
      'description': 'Opis',
      'cancelButton': 'Odustani',
      'noTitle': '(Nema naslova)',
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

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('treeObj')
  public treeObj: TreeViewComponent;
  public groupSettings: GroupModel = { byGroupID: false};
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  appointment: Appointment;
  doctor: Doctor;
  patient: Patient;

  constructor(private _repositoryService: RepositoryService){
    // let now = moment();
    // console.log(now.add(10, 'minutes').format('YYYY,M,D h:mm:ss a'));
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

    //  this._repositoryService.postAppointment(this.appointments)
    //    .subscribe(request => {
    //      this.appointments.push(request);
    //      console.log(request);
    //    })

    // addAppointment() {
    //   this._repositoryService.postAppointment(this.appointment)
    //     .subscribe(appointmentData => {
    //       console.log(appointmentData)
    //       this.getAppointment();
    //     })
    // }

    this._repositoryService.getAppointment()
      .subscribe((appointmentData) => {
        console.log(appointmentData);
        this.appointments = appointmentData;
        let mapped = this.appointments.map((appointment: Appointment) => {
          return {
            Id: appointment.id,
            StartTime: moment(appointment.dateTime).format('YYYY,M,D h:mm:ss a'),
            EndTime: moment(appointment.dateTime).add(15, 'minutes').format('YYYY,M,D h:mm:ss a'),
            doctors: appointment.doctorId,
            patients: appointment.patientId,
            Description: appointment.status,
          }
        })
        this.eventObject = {
          dataSource: mapped
        }
      })

    // const studentsObservable = this._repositoryService.getSchedule();
    // studentsObservable.subscribe((appointments: Appointment[]) => {
    //   let initialData: Object[] = <Object[]>extend([], 
    //   this.scheduleObj.eventSettings.dataSource, null, true);
    //   appointments.forEach(element => {
    //     if (element.id < "16") {
    //       initialData.push(element);
    //     }
    //   })
    //   this.scheduleObj.eventSettings.dataSource = initialData;
    // });
  }

  public allowEditing: boolean = true;

  // public group: GroupModel = {
  //   byGroupID: false,
  //   resources: ["Doktori", "Pacijenti"]
  // };

  public setView: View = 'Month'; //postavljanje početnog pogleda na kalendar, izmjena izmedu Day, Week, WorkWeek, Month, Agenda
  public setDate: Date = new Date(); //postavljanje datuma po želji
  public dateFormat: string = "dd/MM/yyyy";

  /* DROPDOWN LIST */
  // public poljaDoc: Object = { text: 'name', value: 'id'};
  // public onFiltering: EmitType =  (e: FilteringEventArgs) => {
  //       let query = new Query();
  //       query = (e.text != "") ? query.where("name", "startswith", e.text, true) : query;
  //       e.updateData(this.doctors, query);
  // };
  // public sorting: string = 'Ascending';

  public DocDataSource: {[key:string]: Object}[] = [
    { name: "Ivica", id: 1},
    { name: "Perica", id: 2}
  ];
  public PacDataSource: Object[] = [
    { name: "Marica", id: 1, PacGroupId: "03272354-6fdc-4f41-60ec-08d808629d13" },
    { name: "Ivana", id: 2, PacGroupId: "03272354-6fdc-4f41-60ec-08d808629d13" },
    { name: "Klara", id: 3, PacGroupId: "87e81399-4c6f-428c-60ee-08d808629d13" }
  ];

  public eventObject: EventSettingsModel = {}
    /*fields: {
      subject: { name: 'Subject', default: "Pozdrav" }
    }*/

  onTreeDragStop(args: DragAndDropEventArgs): void {
    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(args.target);
    let eventData: { [key: string]: Object } = {
      Subject: args.draggedNodeData.text,
      StartTime: cellData.startTime,
      EndTime: cellData.endTime,
      IsAllDay: cellData.isAllDay
    };
    this.scheduleObj.addEvent(eventData);
  }

  onDragStart(args: DragEventArgs): void {
    args.interval = 5;
    args.navigation.enable = true;
  }
  
  onResizeStart(args: ResizeEventArgs): void {
    args.interval = 5;
  }

  this
}
