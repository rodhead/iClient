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
  SchoolTimetableDetail: SchoolTimetableDetailModal;
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
    private storage: ApplicationStorage
  ) {}

  ngOnInit() {
    this.Classes = this.storage.GetClasses();
    this.LoadInitData();
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
