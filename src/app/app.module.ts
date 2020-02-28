import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AjaxService } from "src/providers/ajax.service";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { iNavigation } from "src/providers/iNavigation";
import { PageCache } from "src/providers/PageCache";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./home/home.component";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { HeaderComponent } from "./header/header.component";
import { FacultyRegistrationComponent } from "./faculty-registration/faculty-registration.component";
import { StudentRegistrationComponent } from "./student-registration/student-registration.component";
import { StaffRegistrationComponent } from "./staff-registration/staff-registration.component";
import { QuickRegistrationComponent } from "./quick-registration/quick-registration.component";
import { StudentReportComponent } from "./student-report/student-report.component";
import { FacultyReportComponent } from "./faculty-report/faculty-report.component";
import { StaffReportComponent } from "./staff-report/staff-report.component";
import { VehicleLocationComponent } from "./vehicle-location/vehicle-location.component";
import { TrackOnMapComponent } from "./track-on-map/track-on-map.component";
import { TimetableComponent } from "./timetable/timetable.component";
import { AttendanceComponent } from "./attendance/attendance.component";
import { ViewClassesComponent } from "./view-classes/view-classes.component";
import { SubjectsComponent } from "./subjects/subjects.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { UploadRecordsComponent } from "./upload-records/upload-records.component";
import { ViewResultsComponent } from "./view-results/view-results.component";
import { FloatOnlyDirective } from "src/providers/directives/FloatType";
import { NumberOnlyDirective } from "src/providers/directives/NumberType";
import { MobileNumber } from "src/providers/directives/MobileNumber";
import { NumberDirective } from "src/providers/directives/Number";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IautocompleteComponent } from "./iautocomplete/iautocomplete.component";
import { DynamicGridComponent } from './dynamic-grid/dynamic-grid.component';
import { PageBreadCrumComponent } from './page-bread-crum/page-bread-crum.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    SideMenuComponent,
    HeaderComponent,
    FacultyRegistrationComponent,
    StudentRegistrationComponent,
    StaffRegistrationComponent,
    QuickRegistrationComponent,
    StudentReportComponent,
    FacultyReportComponent,
    StaffReportComponent,
    VehicleLocationComponent,
    TrackOnMapComponent,
    TimetableComponent,
    AttendanceComponent,
    ViewClassesComponent,
    SubjectsComponent,
    CalendarComponent,
    UploadRecordsComponent,
    ViewResultsComponent,
    FloatOnlyDirective,
    NumberOnlyDirective,
    MobileNumber,
    NumberDirective,
    IautocompleteComponent,
    DynamicGridComponent,
    PageBreadCrumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AjaxService, ApplicationStorage, iNavigation, PageCache],
  bootstrap: [AppComponent]
})
export class AppModule {}
