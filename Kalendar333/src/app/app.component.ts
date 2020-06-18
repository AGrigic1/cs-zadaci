import { Component, ViewChild } from '@angular/core';
import { View, EventSettingsModel, DragEventArgs, ResizeEventArgs, ScheduleComponent, CellClickEventArgs, ActionEventArgs } from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs, TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { L10n } from '@syncfusion/ej2-base';
import { Http, Response } from '@angular/http';
import { DataManager, WebApiAdaptor, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
  
}