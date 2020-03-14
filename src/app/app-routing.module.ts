import { RolesComponent } from "./roles/roles.component";
import { ManagetimetableComponent } from "./managetimetable/managetimetable.component";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {
  Dashboard,
  Attendence,
  Calendar,
  StaffMemberRegistration,
  QuickRegistration,
  StaffRegistration,
  StudentRegistration,
  StudentReports,
  Subjects,
  TimeTable,
  TrackOnMap,
  UploadData,
  VehicleLocation,
  ViewClasses,
  ExamResult,
  FacultyRegistration,
  FacultyReports,
  StaffReports,
  Roles,
  ManageUser,
  ManageTimetable
} from "./../providers/constants";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AttendanceComponent } from "./attendance/attendance.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { FacultyRegistrationComponent } from "./faculty-registration/faculty-registration.component";
import { QuickRegistrationComponent } from "./quick-registration/quick-registration.component";
import { StaffRegistrationComponent } from "./staff-registration/staff-registration.component";
import { StudentRegistrationComponent } from "./student-registration/student-registration.component";
import { StudentReportComponent } from "./student-report/student-report.component";
import { SubjectsComponent } from "./subjects/subjects.component";
import { TimetableComponent } from "./timetable/timetable.component";
import { TrackOnMapComponent } from "./track-on-map/track-on-map.component";
import { UploadRecordsComponent } from "./upload-records/upload-records.component";
import { VehicleLocationComponent } from "./vehicle-location/vehicle-location.component";
import { ViewClassesComponent } from "./view-classes/view-classes.component";
import { ViewResultsComponent } from "./view-results/view-results.component";
import { FacultyReportComponent } from "./faculty-report/faculty-report.component";
import { StaffReportComponent } from "./staff-report/staff-report.component";
import { ManageuserComponent } from "./manageuser/manageuser.component";

const routes: Routes = [
  { path: "", component: AppComponent },
  { path: Dashboard, component: DashboardComponent },
  { path: Attendence, component: AttendanceComponent },
  { path: Calendar, component: CalendarComponent },
  { path: StaffMemberRegistration, component: FacultyRegistrationComponent },
  { path: FacultyRegistration, component: FacultyRegistrationComponent },
  { path: QuickRegistration, component: QuickRegistrationComponent },
  { path: StaffRegistration, component: StaffRegistrationComponent },
  { path: StudentRegistration, component: StudentRegistrationComponent },
  { path: StudentReports, component: StudentReportComponent },
  { path: Subjects, component: SubjectsComponent },
  { path: TimeTable, component: TimetableComponent },
  { path: TrackOnMap, component: TrackOnMapComponent },
  { path: UploadData, component: UploadRecordsComponent },
  { path: VehicleLocation, component: VehicleLocationComponent },
  { path: ViewClasses, component: ViewClassesComponent },
  { path: FacultyReports, component: FacultyReportComponent },
  { path: StaffReports, component: StaffReportComponent },
  { path: ManageTimetable, component: ManagetimetableComponent },
  { path: ManageUser, component: ManageuserComponent },
  { path: Roles, component: RolesComponent },
  { path: ExamResult, component: ViewResultsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
