import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import {
  DefaultUserImage,
  FacultyRegistration,
  StaffMemberRegistration
} from "src/providers/constants";
import * as $ from "jquery";
import {
  CommonService,
  IsValidType
} from "src/providers/common-service/common.service";
import { ApplicationStorage } from "./../../providers/ApplicationStorage";
import { AjaxService } from "src/providers/ajax.service";
import { ClassDetail } from "../app.component";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-faculty-registration",
  templateUrl: "./faculty-registration.component.html",
  styleUrls: ["./faculty-registration.component.scss"]
})
export class FacultyRegistrationComponent implements OnInit {
  UserData: any = {};
  steps: any = {};
  FacultyImageType: any;
  FacultyForm: FormGroup;
  FacultyImage: any;
  ClassDetail: Array<ClassDetail>;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  TitleDetail: string;
  Title: string;
  IsFaculty: boolean = false;
  FacultyRoles: Array<any> = [];
  dateModel: NgbDateStruct;
  date: { year: number; month: number };
  ExprienceInYear: Array<any> = [];
  SubjectDetail: any;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private storage: ApplicationStorage,
    private http: AjaxService,
    private calendar: NgbCalendar
  ) {
    this.MangePageInformation();
    this.ClassDetail = this.storage.GetClassDetail();
    this.InitPage();
    this.FacultyImage = DefaultUserImage;
  }

  selectToday() {
    this.dateModel = this.calendar.getToday();
  }

  MangePageInformation() {
    if (this.commonService.GetCurrentPageName() === FacultyRegistration) {
      this.TitleDetail = "Faculty or Teaching staff registration page.";
      this.Title = "Faculty Registration";
      this.IsFaculty = true;
    } else if (
      this.commonService.GetCurrentPageName() === StaffMemberRegistration
    ) {
      this.TitleDetail = "Non-Teaching staff registration page.";
      this.Title = "Staff Registration";
      this.IsFaculty = false;
      this.FacultyRoles.push(
        {
          RoleName: "Faculty"
        },
        {
          RoleName: "Driver"
        }
      );
    }
  }

  InitPage() {
    this.SubjectDetail = [
      {
        value: "alsdghalsgh",
        text: "English"
      }
    ];

    this.Classes = this.storage.GetClasses();
    this.FacultyForm = this.fb.group({
      FacultyUid: new FormControl("", Validators.required),
      StaffMemberUid: new FormControl("", Validators.required),
      SchooltenentId: new FormControl("", Validators.required),
      ClassDetailId: new FormControl("", Validators.required),
      Class: new FormControl("", Validators.required),
      Designation: new FormControl("", Validators.required),
      Section: new FormControl("", Validators.required),
      FirstName: new FormControl("", Validators.required),
      LastName: new FormControl("", Validators.required),
      Gender: new FormControl(false, Validators.required),
      Dob: new FormControl(this.dateModel, Validators.required),
      Doj: new FormControl("", Validators.required),
      MobileNumber: new FormControl("", Validators.required),
      AlternetNumber: new FormControl("", Validators.required),
      ImageUrl: new FormControl("", Validators.required),
      Email: new FormControl("", Validators.required),
      Address: new FormControl("", Validators.required),
      City: new FormControl("", Validators.required),
      State: new FormControl("", Validators.required),
      Pincode: new FormControl("", Validators.required),
      Subjects: new FormControl("", Validators.required),
      Type: new FormControl("", Validators.required),
      University: new FormControl("", Validators.required),
      DegreeName: new FormControl("", Validators.required),
      Grade: new FormControl("", Validators.required),
      Marks: new FormControl(0, Validators.required),
      ExprienceInYear: new FormControl("0", Validators.required),
      ExperienceInMonth: new FormControl("0", Validators.required),
      QualificationId: new FormControl("", Validators.required)
    });

    this.ScrollTop();
  }

  OnSubjectSelected(e: any) {
    if (IsValidType(e)) {
      let Data = JSON.parse(e);
      let Subjects = "";
      if (IsValidType(this.FacultyForm.get("Subjects").value)) {
        Subjects = this.FacultyForm.get("Subjects").value;
      }
      Subjects += Data.value;
      this.FacultyForm.controls["Subjects"].setValue(Subjects);
    }
  }

  RegisterFaculty() {
    let ErrorFields = [];
    try {
      if (this.IsFaculty) {
        if (IsValidType(this.FacultyForm.get("Section").value)) {
          let Uid = this.FacultyForm.get("Section").value;
          let CutClassDetail: Array<ClassDetail> = this.ClassDetail.filter(
            x => x.ClassDetailId === Uid
          );
          if (CutClassDetail.length > 0) {
            this.FacultyForm.controls["Section"].setValue(
              CutClassDetail[0].Section
            );
            this.FacultyForm.controls["ClassDetailId"].setValue(Uid);
          }
        }

        if (!IsValidType(this.FacultyForm.get("ExprienceInYear").value)) {
          ErrorFields.push("ExprienceInYear");
        }

        if (!IsValidType(this.FacultyForm.get("ExperienceInMonth").value)) {
          ErrorFields.push("ExperienceInMonth");
        }
      }

      if (!IsValidType(this.FacultyForm.get("FirstName").value)) {
        ErrorFields.push("FirstName");
      }

      if ($("#male").is(":checked")) {
        this.FacultyForm.controls["Gender"].setValue(true);
      } else {
        this.FacultyForm.controls["Gender"].setValue(false);
      }

      if (IsValidType(this.FacultyForm.get("Dob").value)) {
        let Year = this.FacultyForm.value.Dob.year;
        let Month = this.FacultyForm.value.Dob.month - 1;
        let Day = this.FacultyForm.value.Dob.day;
        try {
          let UserDob: any = new Date(Year, Month, Day);
          if (!isNaN(UserDob.getTime())) {
            this.FacultyForm.controls["Dob"].setValue(UserDob);
          }
        } catch (e) {
          this.commonService.ShowToast("Invalid date selected.");
          return;
        }
      } else {
        this.FacultyForm.controls["Dob"].setValue(new Date());
      }

      if (!IsValidType(this.FacultyForm.get("MobileNumber").value)) {
        ErrorFields.push("MobileNumber");
      }

      if (!IsValidType(this.FacultyForm.get("Address").value)) {
        ErrorFields.push("Address");
      }

      if (!IsValidType(this.FacultyForm.get("Pincode").value)) {
        ErrorFields.push("Pincode");
      }

      if (IsValidType(this.FacultyForm.get("Email").value)) {
        let FacultyEmail = this.FacultyForm.get("Email").value;
        let PartedValue = FacultyEmail.split("@");
        if (PartedValue.length == 2) {
          if (PartedValue[0].length == 0 || PartedValue[1].length == 0) {
            ErrorFields.push("Email");
          }
        } else {
          ErrorFields.push("Email");
        }

        let DotCheck = FacultyEmail.lastIndexOf(".");
        if (DotCheck !== -1) {
          if (DotCheck.length <= DotCheck) {
            ErrorFields.push("Email");
          }
        } else {
          ErrorFields.push("Email");
        }
      }

      if (!this.IsFaculty) {
        if (!IsValidType(this.FacultyForm.get("Designation").value)) {
          ErrorFields.push("Designation");
          this.commonService.ShowToast(
            "Faculty roles is required. Please correct (*) marked fields."
          );
        }
      } else {
        this.FacultyForm.controls["Designation"].setValue("Faculty");
      }

      if (ErrorFields.length > 0) {
        ErrorFields.forEach((val, index) => {
          $("#" + val).addClass("error-filed");
        });
      } else {
        let formData = new FormData();
        formData.append("image", this.FacultyImageType);
        let FacultyObject = this.FacultyForm.value;
        formData.append("facultObject", JSON.stringify(FacultyObject));

        this.http.upload("Registration/Faculty", formData).then(
          response => {
            if (
              this.commonService.IsValidResponse(response) &&
              response.ResponseBody === "Registration done successfully"
            ) {
              this.commonService.ShowToast("Registration done successfully.");
              this.InitPage();
              let Data = response.content.data;
              if (Data != null && Data != "") {
                this.commonService.ShowToast("Data retrieve successfully.");
              } else {
              }
            } else {
              this.commonService.ShowToast("Unable to save data.");
            }
          },
          error => {
            this.commonService.ShowToast(
              "Server error. Please contact to admin."
            );
          }
        );
      }
    } catch (ex) {
      console.log("Got error");
    }
  }

  ScrollTop() {
    this.commonService.Scrollto($("body"));
  }

  GetFile(fileInput: any) {
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      this.FacultyImageType = <File>Files[0];
      let mimeType = this.FacultyImageType.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(this.FacultyImageType);
      reader.onload = fileEvent => {
        this.FacultyImage = reader.result;
      };
    } else {
      this.commonService.ShowToast("No file selected");
    }
  }

  GetImage() {
    $("#browsfile").click();
    event.preventDefault();
  }

  ngOnInit() {}

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    if (IsValidType(Class)) {
      $("#section").removeAttr("disabled");
      this.Sections = this.ClassDetail.filter(x => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    } else {
      document.getElementById("section").setAttribute("disabled", "disabled");
    }
  }
}
