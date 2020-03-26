import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {
  CommonService,
  IsValidType
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { FormArray } from "@angular/forms";
import { FormControl, Validators } from "@angular/forms";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import * as $ from "jquery";
import {
  InvalidData,
  SuccessMessage,
  ZerothIndex
} from "src/providers/constants";
import { ClassDetail } from "../app.component";
import { ApplicationStorage } from "src/providers/ApplicationStorage";
import { AttendanceSheetModal } from "../attendance/attendance.component";
import { Chart } from "chart.js";

@Component({
  selector: "app-view-results",
  templateUrl: "./view-results.component.html",
  styleUrls: ["./view-results.component.scss"]
})
export class ViewResultsComponent implements OnInit {
  attendanceData: FormGroup;
  IsReady: boolean = false;
  chartBar = [];
  ClassDetailUid: string;
  StudentAttendanceData: any;
  SubjectReport: Array<ProgressResultModal>;
  ClassDetail: Array<ClassDetail>;
  CoScholasticData: Array<CoScholasticAreaModal>;
  Sections: Array<ClassDetail>;
  Classes: Array<string>;
  dateModel: NgbDateStruct;
  SelecteClass: string;
  ViewReport: boolean;
  AttendanceSheet: Array<AttendanceSheetModal>;
  TodayDayNum: string;
  get AttendaceDetail(): FormArray {
    return this.attendanceData.get("AttendaceDetail") as FormArray;
  }
  data = {
    labels: [
      "English",
      "Hindi",
      "Mathamatics",
      "Science",
      "Social Stydy",
      "Foundation of IT"
    ],
    datasets: [
      {
        label: "Obtainer Marks",
        data: [50, 100, 60, 120, 80, 100, 60],
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255,99,132,.6)",
        borderWidth: 1
      }
    ]
  };
  options = {
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "rgba(0,0,0,.6)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 8,
            padding: 10
          },
          gridLines: {
            drawTicks: true,
            drawBorder: true,
            display: true,
            color: "rgba(0,0,0,.1)"
            // zeroLineColor: 'transparent'
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            // zeroLineColor: 'transparent',
            display: true
          },
          ticks: {
            padding: 0,
            fontColor: "rgba(0,0,0,0.6)",
            fontStyle: "bold"
          }
        }
      ]
    },
    responsive: true
  };

  constructor(
    private fb: FormBuilder,
    private http: AjaxService,
    private commonService: CommonService,
    private storage: ApplicationStorage
  ) {
    this.ViewReport = false;
    this.TodayDayNum = new Date().getDate().toString();
  }

  ngOnInit() {
    //this.UpdateAttendance();
    this.SelecteClass = "";
    this.ClassDetail = this.storage.GetClassDetail();
    this.Classes = this.storage.GetClasses();
    this.ClassDetailUid = "";
    this.selectDate(new Date());
    if (this.ViewReport) {
      this.SelectDefault();
    } else {
      this.InitTemporaryData();
    }
  }

  SelectDefault() {
    if (IsValidType(this.ClassDetail)) {
      let FirstItem = this.ClassDetail[ZerothIndex];
      this.BindSections(FirstItem.Class);
      this.SelecteClass = FirstItem.Class;
      this.ClassDetailUid = FirstItem.ClassDetailUid;
      this.LoadData();
    } else {
      this.InitAttendance();
      this.IsReady = true;
    }
  }

  selectDate(date: Date) {
    if (date !== null) {
      let selectedDate: NgbDateStruct = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      this.dateModel = selectedDate;
    }
  }

  SubmitAttendance() {
    if (IsValidType(this.attendanceData.controls.AttendaceDetail)) {
      let ServerData = this.attendanceData.controls.AttendaceDetail.value;
      this.http
        .post("AdminMaster/AddUpdateSingleClassAttendence", ServerData)
        .then(result => {
          if (IsValidType(result)) {
            this.commonService.ShowToast(SuccessMessage);
          } else {
            this.commonService.ShowToast(InvalidData);
          }
        });
    } else {
      this.commonService.ShowToast(InvalidData);
    }
  }

  UpdateAttendance() {
    let AttendanceList = this.LoadDemoData();
    this.http
      .post("AdminMaster/AddUpdateAttendence", AttendanceList)
      .then(result => {
        if (IsValidType(result.ResponseBody)) {
          let Data = JSON.parse(result.ResponseBody);
          if (IsValidType(Data["Table"])) {
            this.AttendanceSheet = Data["Table"];
            this.InitAttendance();
          } else {
            this.commonService.ShowToast(InvalidData);
          }
          this.commonService.ShowToast(SuccessMessage);
        } else {
          this.commonService.ShowToast(InvalidData);
        }
      });
  }

  LoadData() {
    this.http
      .post("AdminMaster/AttendenceByClassDetail", {
        ClassDetailUid: this.ClassDetailUid,
        CreatedOn: new Date(
          this.dateModel.year,
          this.dateModel.month,
          this.dateModel.day
        )
      })
      .then(result => {
        if (IsValidType(result.ResponseBody)) {
          let Data = JSON.parse(result.ResponseBody);
          if (IsValidType(Data["Table"])) {
            this.AttendanceSheet = Data["Table"];
            this.InitAttendance();
            this.IsReady = true;
          } else {
            this.commonService.ShowToast(InvalidData);
          }
          this.commonService.ShowToast(SuccessMessage);
        } else {
          this.commonService.ShowToast(InvalidData);
        }
      });
  }

  InitAttendance() {
    this.attendanceData = this.fb.group({
      AttendaceDetail: this.fb.array(this.BindStudentData())
    });
  }

  BindStudentData(): Array<FormGroup> {
    let index = 0;
    let Data: Array<FormGroup> = [];
    if (IsValidType(this.AttendanceSheet)) {
      while (index < this.AttendanceSheet.length) {
        Data.push(
          this.BuildStudentAttendanceDetail(this.AttendanceSheet[index])
        );
        index++;
      }
    }
    return Data;
  }

  BuildStudentAttendanceDetail(
    AttendanceData: AttendanceSheetModal
  ): FormGroup {
    return new FormGroup({
      StudentUid: new FormControl(AttendanceData.StudentUid),
      StudentName: new FormControl(
        `${AttendanceData.FirstName} ${AttendanceData.LastName}`
      ),
      ClassDetailUid: new FormControl(AttendanceData.ClassDetailUid),
      Class: new FormControl(AttendanceData.Class),
      Section: new FormControl(AttendanceData.Section),
      Date: new FormControl(new Date()),
      RollNo: new FormControl(AttendanceData.RollNo),
      IsPresent: new FormControl(
        AttendanceData[`Day${this.dateModel.day}`] === null ||
        AttendanceData[`Day${this.dateModel.day}`] === 0
          ? false
          : true
      )
    });
  }

  ToggleItem(studentUid: string) {
    if (studentUid !== null && studentUid !== "") {
      let $e = $(event.currentTarget).find('div[name="slider"]');
      if ($e.hasClass("off")) {
        $e.removeClass("off");
      } else {
        $e.addClass("off");
      }

      let Controls = this.attendanceData.get("AttendaceDetail")["controls"];
      let index = 0;
      let CurrentStudent: FormGroup = null;
      while (index < Controls.length) {
        if (Controls[index].controls.StudentUid.value === studentUid) {
          CurrentStudent = Controls[index];
          CurrentStudent.get("IsPresent").setValue(true);
          break;
        }
        index++;
      }
    } else {
      this.commonService.ShowToast(
        "Invalid student selected. Please contact to admin."
      );
    }
  }

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    this.BindSections(Class);
  }

  BindSections(Class) {
    if (IsValidType(Class)) {
      this.Sections = this.ClassDetail.filter(x => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    }
  }

  ManageSection() {}

  ResetFilter() {}

  GetAdvanceFilter() {
    if (this.ClassDetailUid !== null && this.ClassDetailUid !== "") {
      this.LoadData();
    } else {
      this.commonService.ShowToast("Please select Class and Section.");
    }
  }

  LoadDemoData() {
    return [
      {
        AttendanceUid: "1584652021295",
        StudentUid: "1523370181157",
        TanentUid: "1523370179180",
        ClassDetailUid: "1523370179638",
        AttendanceMonth: 2,
        AttendanceYear: 2020,
        Day1: true,
        Day2: true,
        Day3: true,
        Day4: true,
        Day5: true,
        Day6: true,
        Day7: true,
        Day8: true,
        Day9: true,
        Day10: true,
        Day11: false,
        Day12: false,
        Day13: false,
        Day14: false,
        Day15: false,
        Day16: false,
        Day17: false,
        Day18: false,
        Day19: false,
        Day20: false,
        Day21: false,
        Day22: false,
        Day23: false,
        Day24: false,
        Day25: false,
        Day26: false,
        Day27: false,
        Day28: false,
        Day29: false,
        Day30: false,
        Day31: true,
        CreatedOn: new Date(),
        UpdatedOn: new Date(),
        CreatedBy: "1523370179393",
        UpdateBy: ""
      }
    ];
  }

  InitTemporaryData() {
    this.chartBar = new Chart("sales-bar", {
      type: "bar",
      data: this.data,
      options: this.options
    });

    this.StudentAttendanceData = {
      TotalAttendance: 219,
      TotalPresent: 194,
      AttendancePercent: 80
    };

    this.CoScholasticData = [
      {
        Name: "WORK EDUCATION",
        Grade: "A"
      },
      {
        Name: "ART EDUCATION",
        Grade: "A"
      },
      {
        Name: "HEALTH AND PHYSICAL EDUCATION",
        Grade: "B"
      },
      {
        Name: "DESCIPLINE",
        Grade: "A"
      }
    ];

    this.SubjectReport = [
      {
        SubjectName: "English",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Hindi",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Mathamatics",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Science",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Social Study",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Foundation of IT",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      }
    ];
  }
}

interface ProgressResultModal {
  SubjectName: string;
  PeriodicTest: number;
  Notebook: number;
  SubjectEnrichment: number;
  AnnualExam: number;
  MarkedObtain: number;
  Grade: string;
}

interface CoScholasticAreaModal {
  Name: string;
  Grade: string;
}
