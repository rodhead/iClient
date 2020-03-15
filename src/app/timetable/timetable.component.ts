import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { ZerothIndex, InvalidData } from "./../../providers/constants";
import { Component, OnInit } from "@angular/core";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType
} from "src/providers/common-service/common.service";
import { ServerError } from "src/providers/constants";
import { ClassDetail } from "../app.component";
import * as $ from "jquery";

@Component({
  selector: "app-timetable",
  templateUrl: "./timetable.component.html",
  styleUrls: ["./timetable.component.scss"]
})
export class TimetableComponent implements OnInit {
  TimetableDetail: Array<TimetableModal> = [];
  TotalPeriods: number = 8;
  LunchBreakAfter: number = 4;
  WorkingDays: number = 6;
  IsReady: boolean = false;
  LunchAfterPeriod: number = 4;
  EnablePopup: boolean = false;
  ClassDetail: Array<ClassDetail>;
  IsEnableSection: boolean = false;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  FacultyWithSubjects: Array<FacultyWithSubjectsModal> = [];
  Faculties: Array<any> = [];
  SchoolTimetableDetail: SchoolTimetableDetailModal;
  Subjects: Array<any> = [];
  SubjectDetail: any;
  AssignFaculty: FormGroup;
  WeekDaysName: Array<any> = [
    { Num: 1, Name: "Mon" },
    { Num: 2, Name: "Tue" },
    { Num: 3, Name: "Wed" },
    { Num: 4, Name: "Thu" },
    { Num: 5, Name: "Fri" },
    { Num: 6, Name: "Sat" }
  ];
  TimingDetail: Array<TimingDetailModal> = [];
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private storage: ApplicationStorage,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.AssignFaculty = this.fb.group({
      FacultyUid: new FormControl("", Validators.required),
      SubjectUid: new FormControl("", Validators.required),
      ClassDetailUid: new FormControl("", Validators.required),
      Class: new FormControl("", Validators.required)
    });
    this.ClassDetail = this.storage.GetClassDetail();
    this.SubjectDetail = [];
    let Subjects = this.storage.get(null, "Subject");
    if (IsValidType(Subjects)) {
      Subjects.map(item => {
        this.SubjectDetail.push({
          value: item.SubjectId,
          text: item.subjectName
        });
      });
      this.SubjectDetail;
    }
    this.Classes = this.storage.GetClasses();
    this.LoadInitData();
  }

  AssignChanges() {
    if (this.AssignFaculty.valid) {
      let Error = [];
      if (!IsValidType(this.AssignFaculty.get("FacultyUid").value)) {
        Error.push("FacultyUid");
      }

      if (!IsValidType(this.AssignFaculty.get("FacultyUid").value)) {
        Error.push("SubjectUid");
      }

      if (!IsValidType(this.AssignFaculty.get("FacultyUid").value)) {
        Error.push("ClassDetailUid");
      }

      if (Error.length > 0) {
        this.commonService.ShowToast(
          "All fields are required. Please fill all fields before submit."
        );
      }
    } else {
      this.commonService.ShowToast(
        "All fields are required. Please fill all fields before submit."
      );
    }
  }

  LoadInitData() {
    this.http
      .get("Events/GetTimetable")
      .then(result => {
        if (IsValidType(result)) {
          let Data = JSON.parse(result.ResponseBody);
          if (typeof Data["SchoolTimetableDetail"] !== "undefined") {
            if (Data["SchoolTimetableDetail"].length > 0) {
              this.SchoolTimetableDetail =
                Data["SchoolTimetableDetail"][ZerothIndex];

              if (typeof Data["TimingDetail"] !== "undefined") {
                this.BuildTimeDetail(Data["TimingDetail"]);
              }

              if (typeof Data["TimetableInfo"] !== "undefined") {
              }

              if (typeof Data["FacultyWithSubjectDetail"] !== "undefined") {
                this.FacultyWithSubjects = Data["FacultyWithSubjectDetail"];
              }
              this.IsReady = true;
            } else {
              this.commonService.ShowToast(InvalidData);
            }
          } else {
            this.commonService.ShowToast(InvalidData);
          }
        }
      })
      .catch(err => {
        this.commonService.ShowToast(ServerError);
      });
  }

  BuildTimeDetail(TimeDetailObject: any) {
    let index = 0;
    this.TimingDetail = [];
    while (index < TimeDetailObject.length) {
      if (this.SchoolTimetableDetail.LunchAfterPeriod === index) {
        let LunchTimingDetail = TimeDetailObject.filter(
          x => x.RuleName === "lunch"
        );
        if (LunchTimingDetail.length > 0) {
          LunchTimingDetail = LunchTimingDetail[ZerothIndex];
          this.TimingDetail.push({
            TimingDetailUid: LunchTimingDetail.TimingDetailUid,
            RulebookUid: LunchTimingDetail.RulebookUid,
            RuleName: LunchTimingDetail.RuleName,
            TimingFor: "R",
            RuleCode: LunchTimingDetail.RuleCode,
            DurationInHrs: LunchTimingDetail.DurationInHrs,
            DurationInMin: LunchTimingDetail.DurationInMin
          });
        }
      }

      if (TimeDetailObject[index].RuleName !== "lunch") {
        this.TimingDetail.push({
          TimingDetailUid: TimeDetailObject[index].TimingDetailUid,
          RulebookUid: TimeDetailObject[index].RulebookUid,
          RuleName: TimeDetailObject[index].RuleName,
          TimingFor: TimeDetailObject[index].TimingFor.replace(
            "period",
            ""
          ).trim(),
          RuleCode: TimeDetailObject[index].RuleCode,
          DurationInHrs: TimeDetailObject[index].DurationInHrs,
          DurationInMin: TimeDetailObject[index].DurationInMin
        });
      }
      index++;
    }
  }

  BuildTimetableInfo(TimetableInfo: any) {}

  OpenSubjectSelection() {
    this.EnablePopup = true;
  }

  Close() {
    this.EnablePopup = false;
  }

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    if (IsValidType(Class)) {
      this.BindSections(Class);
    } else {
      document.getElementById("section").setAttribute("disabled", "disabled");
    }
  }

  BindSections(Class) {
    this.IsEnableSection = false;
    if (IsValidType(Class)) {
      this.Sections = this.ClassDetail.filter(x => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    }
  }

  OnSubjectSelected(value: any) {
    let SelectedValue = JSON.parse(value);
    if (IsValidType(SelectedValue)) {
      this.AssignFaculty.get("SubjectUid").setValue(SelectedValue.value);
      this.GetFacultyBySubject(SelectedValue.value);
    }
  }

  GetFacultyBySubject(SubjectUid: string) {
    if (IsValidType(SubjectUid)) {
      let FacultyData = this.FacultyWithSubjects.filter(
        x => x.SubjectUid === SubjectUid
      );
      if (FacultyData.length > 0) {
        FacultyData.map(x => {
          this.Faculties.push({
            value: x.SubjectUid,
            text: `${x.FirstName} ${x.LastName}`
          });
        });
      }

      if (this.Faculties.length === 0) {
        this.commonService.ShowToast("No faculty available for this subject.");
      }
    }
  }

  OnFacultySelected(value: any) {
    let SelectedValue = JSON.parse(value);
    if (IsValidType(SelectedValue)) {
      this.AssignFaculty.get("FacultyUid").setValue(SelectedValue.value);
    }
  }
}

class TimetableModal {
  Day: string = "";
  Subjects: Array<any> = [];
}

interface TimingDetailModal {
  TimingDetailUid: string;
  RulebookUid: string;
  TimingFor: string;
  DurationInHrs: string;
  DurationInMin: string;
  RuleCode: number;
  RuleName: string;
}

interface SchoolTimetableDetailModal {
  SchoolOtherDetailUid: string;
  TotalNoOfPeriods: number;
  SchoolStartTime: string;
  LunchBreakTime: string;
  LunchBreakDuration: string;
  LunchAfterPeriod: number;
  Mon: number;
  Tue: number;
  Wed: number;
  Thu: number;
  Fri: number;
  Sat: number;
  Sun: number;
}

interface FacultyWithSubjectsModal {
  StaffMemberUid: string;
  ClassTeacherForClass: string;
  FirstName: string;
  LastName: string;
  Gender: number;
  Dob: string;
  Doj: string;
  MobileNumber: string;
  AlternetNumber: string;
  SubjectUid: string;
}
