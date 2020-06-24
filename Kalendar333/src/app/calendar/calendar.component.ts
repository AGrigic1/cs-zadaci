import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n, EmitType } from '@syncfusion/ej2-base';
import { View, EventSettingsModel, DragEventArgs, ResizeEventArgs, ScheduleComponent, CellClickEventArgs, ActionEventArgs, GroupModel, TimelineMonthService  } from '@syncfusion/ej2-angular-schedule';
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
  @ViewChild('doctorOneObj') doktorOneObj: CheckBoxComponent;
  @ViewChild('doctorTwoObj') doktorTwoObj: CheckBoxComponent;
  @ViewChild('doctorThreeObj') doktorThreeObj: CheckBoxComponent;
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

  // public group: GroupModel = {
  //   byGroupID: false,
  //   resources: ["Doktori", "Pacijenti"]
  // };

  public setView: View = 'Month'; //postavljanje početnog pogleda na kalendar, izmjena izmedu Day, Week, WorkWeek, Month, Agenda
  public setDate: Date = new Date(2020,4,28); //postavljanje datuma po želji
  public dateFormat: string = "dd/MM/yyyy";

  /* DROPDOWN LIST */
  public poljaDoc: Object = { text: 'name', value: 'id'};
  public onFiltering: EmitType =  (e: FilteringEventArgs) => {
        let query = new Query();
        query = (e.text != "") ? query.where("name", "startswith", e.text, true) : query;
        e.updateData(this.doctors, query);
  };
  public sorting: string = 'Ascending';

  public DocDataSource: {[key:string]: Object}[] = [
    { name: "Ivica", id: 1},
    { name: "Perica", id: 2}
  ];
  public PacDataSource: Object[] = [
    { name: "Marica", id: 1, PacGroupId: "03272354-6fdc-4f41-60ec-08d808629d13" },
    { name: "Ivana", id: 2, PacGroupId: "03272354-6fdc-4f41-60ec-08d808629d13" },
    { name: "Klara", id: 3, PacGroupId: "87e81399-4c6f-428c-60ee-08d808629d13" }
  ];

  public eventObject: EventSettingsModel = {
    dataSource: 
    [{
      Id: 1,
      StartTime: new Date(2020,4,25,10,0), //rucno postavljanje eventa
      EndTime: new Date(2020,4,25,12,0),
      doctors: "03272354-6fdc-4f41-60ec-08d808629d13",
      patients: 1
    },
    {
      Id: 2,
      Subject: "Testing2",
      StartTime: new Date(2020,4,28,10,0),
      EndTime: new Date(2020,4,28,12,0),
      Location: "Krov",
      Description: "Sta?"
    }
    ], 
    /*fields: {
      subject: { name: 'Subject', default: "Pozdrav" }
    }*/
  }

  onChange(): void {
    let predicate: Predicate;
    let checkBoxes: CheckBoxComponent[] = [this.doktorOneObj, this.doktorTwoObj, this.doktorThreeObj];
    checkBoxes.forEach((checkBoxObj: CheckBoxComponent) => {
      if (checkBoxObj.checked) {
        if (predicate) {
          predicate = predicate.or("id", 'equal', parseInt(checkBoxObj.value, 10));
        } else {
          predicate = new Predicate("id", 'equal', parseInt(checkBoxObj.value, 10));
        }
      }
    });
    this.scheduleInstance.eventSettings.query = new Query().where(predicate);
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

}
