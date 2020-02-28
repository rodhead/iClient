import { ApplicationStorage } from "./../../providers/ApplicationStorage";
import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { DefaultUserImage } from "src/providers/constants";
import * as $ from "jquery";
import {
  IsValidType,
  CommonService
} from "src/providers/common-service/common.service";
import { AjaxService } from "src/providers/ajax.service";
import { ClassDetail } from "../app.component";

@Component({
  selector: "app-student-registration",
  templateUrl: "./student-registration.component.html",
  styleUrls: ["./student-registration.component.scss"]
})
export class StudentRegistrationComponent implements OnInit {
  newparent: boolean = true;
  existparent: boolean = true;
  ParentList: Array<ParentDetail> = [];
  Occupation: Array<any> = [];
  Qualification: Array<any> = [];
  languages: Array<string> = [];
  SectionDetail: Array<any> = [];
  IsExistingParent: boolean = false;
  IsUpdating: boolean = true;

  StudentData: StudentModal;
  StudentForm: FormGroup;
  StudentImage: any;
  StudentImageType: any;
  ClassDetail: Array<ClassDetail>;
  Classes: Array<string>;
  Sections: Array<ClassDetail>;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private http: AjaxService,
    private storage: ApplicationStorage
  ) {
    this.ClassDetail = this.storage.GetClassDetail();
    this.StudentImage = DefaultUserImage;
  }

  ngOnInit() {
    this.InitStudentForm();
  }

  ScrollTop() {
    this.commonService.Scrollto($("body"));
  }

  InitStudentForm() {
    this.Classes = this.storage.GetClasses();
    this.StudentForm = this.fb.group({
      StudentUid: new FormControl(""),
      SchooltenentId: new FormControl(""),
      ParentDetailId: new FormControl(""),
      FirstName: new FormControl(""),
      LastName: new FormControl(""),
      ImageUrl: new FormControl(""),
      Dob: new FormControl(""),
      Age: new FormControl(0),
      Sex: new FormControl(""),
      LastSchoolAddress: new FormControl(""),
      LastSchoolName: new FormControl(""),
      LastSchoolMedium: new FormControl(""),
      CurrentSchoolMedium: new FormControl(""),
      Rollno: new FormControl(0),
      Mobilenumber: new FormControl(""),
      AlternetNumber: new FormControl(""),
      EmailId: new FormControl(""),
      RegistrationNo: new FormControl(""),
      AdmissionDatetime: new FormControl(""),
      FeeCode: new FormControl(0),
      MotherTongue: new FormControl(""),
      Religion: new FormControl(""),
      Category: new FormControl(""),
      CategoryDocPath: new FormControl(""),
      SiblingRegistrationNo: new FormControl(""),
      LastClass: new FormControl(""),
      Motherfullname: new FormControl(""),
      Fatherfullname: new FormControl(""),
      FatherFirstName: new FormControl(""),
      FatherLastName: new FormControl(""),
      MotherFirstname: new FormControl(""),
      MotherLastname: new FormControl(""),
      LocalGuardianFullName: new FormControl(""),
      Fathermobileno: new FormControl(""),
      Mothermobileno: new FormControl(""),
      LocalGuardianMobileno: new FormControl(""),
      Address: new FormControl(""),
      City: new FormControl(""),
      Pincode: new FormControl(""),
      State: new FormControl(""),
      Fatheremailid: new FormControl(""),
      Motheremailid: new FormControl(""),
      LocalGuardianemailid: new FormControl(""),
      Fatheroccupation: new FormControl(""),
      Motheroccupation: new FormControl(""),
      Fatherqualification: new FormControl(""),
      Motherqualification: new FormControl(""),
      Class: new FormControl(""),
      Section: new FormControl(""),
      ExistingNumber: new FormControl(""),
      CreatedBy: new FormControl(""),
      ParentRecordExist: new FormControl(false),
      ClassDetailId: new FormControl(""),
      MobileNumbers: new FormControl(""),
      EmailIds: new FormControl(""),
      IsQuickRegistration: new FormControl(false),
      ProfileImageName: new FormControl("")
    });
    this.ScrollTop();
  }

  Addsibling() {}

  Resetall() {}

  RegisterNow() {
    let ErrorFields = [];
    try {
      if (IsValidType(this.StudentForm.get("Fatherfullname").value)) {
        this.StudentForm.controls["FatherFirstName"].setValue("");
        this.StudentForm.controls["FatherLastName"].setValue("");
      } else {
        ErrorFields.push("Fatherfullname");
      }

      if (!IsValidType(this.StudentForm.get("Fathermobileno").value)) {
        ErrorFields.push("Fathermobileno");
      }

      /*-------------------------- Mother detail -------------------------------*/

      if (IsValidType(this.StudentForm.get("Motherfullname").value)) {
        this.StudentForm.controls["MotherFirstname"].setValue("");
        this.StudentForm.controls["MotherLastname"].setValue("");
      } else {
        ErrorFields.push("Motherfullname");
      }

      if (!IsValidType(this.StudentForm.get("MotherTongue").value)) {
        ErrorFields.push("MotherTongue");
      }

      if (!IsValidType(this.StudentForm.get("FirstName").value)) {
        ErrorFields.push("FirstName");
      }

      if (!IsValidType(this.StudentForm.get("Address").value)) {
        ErrorFields.push("Address");
      }

      if (!IsValidType(this.StudentForm.get("City").value)) {
        ErrorFields.push("City");
      }

      if (!IsValidType(this.StudentForm.get("State").value)) {
        ErrorFields.push("State");
      }

      if (!IsValidType(this.StudentForm.get("Class").value)) {
        ErrorFields.push("Class");
      }

      if (IsValidType(this.StudentForm.get("Section").value)) {
        let Uid = this.StudentForm.get("Section").value;
        let SelectedSection = this.ClassDetail.filter(
          x => x.ClassDetailId === Uid
        );
        if (SelectedSection.length > 0) {
          this.StudentForm.controls["ClassDetailId"].setValue(Uid);
          this.StudentForm.controls["Section"].setValue(
            SelectedSection[0].Section
          );
          this.StudentForm.controls["FeeCode"].setValue("0");
        } else {
          ErrorFields.push("Section");
        }
      } else {
        ErrorFields.push("Section");
      }

      if (IsValidType(this.StudentForm.get("Dob").value)) {
        let Year = this.StudentForm.value.Dob.year;
        let Month = this.StudentForm.value.Dob.month - 1;
        let Day = this.StudentForm.value.Dob.day;
        try {
          let UserDob: any = new Date(Year, Month, Day);
          if (!isNaN(UserDob.getTime())) {
            this.StudentForm.controls["Dob"].setValue(UserDob);
            this.StudentForm.controls["Age"].setValue(10);
          }
        } catch (e) {
          this.commonService.ShowToast("Invalid date selected.");
          return;
        }
      } else {
        this.StudentForm.controls["Dob"].setValue(new Date());
      }

      if (!IsValidType(this.StudentForm.get("Sex").value)) {
        this.StudentForm.controls["Sex"].setValue(true);
      }

      if (!IsValidType(this.StudentForm.get("Category").value)) {
        ErrorFields.push("Category");
      }

      if (!IsValidType(this.StudentForm.get("Pincode").value)) {
        ErrorFields.push("Pincode");
      }

      this.StudentForm.controls["AdmissionDatetime"].setValue(new Date());
      if (ErrorFields.length > 0) {
        this.ScrollTop();
        let Form = $("#studentRegistration");
        ErrorFields.forEach((item, index) => {
          if ($(Form).find('input[name="' + item + '"]').length > 0) {
            $(Form)
              .find('input[name="' + item + '"]')
              .addClass("error-filed");
          } else {
            $(Form)
              .find('select[name="' + item + '"]')
              .addClass("error-filed");

            $(Form)
              .find('textarea[name="' + item + '"]')
              .addClass("error-filed");
          }
        });
      } else {
        let formData = new FormData();
        formData.append("image", this.StudentImageType);
        let StudentObject = this.StudentForm.value;
        formData.append("studentObject", JSON.stringify(StudentObject));

        this.http.upload("Registration/StudentRegistration", formData).then(
          response => {
            if (
              this.commonService.IsValidResponse(response) &&
              response.ResponseBody === "Registration done successfully"
            ) {
              this.commonService.ShowToast("Registration done successfully.");
              this.InitStudentForm();
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
    } catch (e) {
      this.commonService.ShowToast(
        "Getting some error. Please re-verify form again."
      );
    }
  }

  GetFile(fileInput: any) {
    let Files = fileInput.target.files;
    if (Files.length > 0) {
      this.StudentImageType = <File>Files[0];
      let mimeType = this.StudentImageType.type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Only images are supported.");
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(this.StudentImageType);
      reader.onload = fileEvent => {
        this.StudentImage = reader.result;
      };
    } else {
      this.StudentImage.ShowToast("No file selected");
    }
  }

  GetImage() {
    $("#browsfile").click();
    event.preventDefault();
  }

  EnableSection() {
    this.Sections = [];
    let Class = $(event.currentTarget).val();
    if (IsValidType(Class)) {
      this.Sections = this.ClassDetail.filter(x => x.Class === Class);
      if (this.Sections.length === 0) {
        this.commonService.ShowToast("Unable to load class detail.");
      }
    }
  }

  ManageSection() {}
}

interface ParentDetail {
  MobileNo: string;
  ParentId: string;
  FullName: string;
}

interface StudentModal {
  StudentUid: string;
  SchooltenentId: string;
  ParentDetailId: string;
  FirstName: string;
  LastName: string;
  ImageUrl: string;
  Dob: Date;
  Age: number;
  Sex: boolean;
  LastSchoolAddress: string;
  LastSchoolName: string;
  LastSchoolMedium: string;
  CurrentSchoolMedium: string;
  Rollno: number;
  Mobilenumber: string;
  AlternetNumber: string;
  EmailId: string;
  RegistrationNo: string;
  AdmissionDatetime: Date;
  FeeCode: number;
  MotherTongue: string;
  Religion: string;
  Category: string;
  CategoryDocPath: string;
  SiblingRegistrationNo: string;
  LastClass: string;
  FatherFirstName: string;
  FatherLastName: string;
  MotherFirstname: string;
  MotherLastname: string;
  LocalGuardianFullName: string;
  Fathermobileno: string;
  Mothermobileno: string;
  LocalGuardianMobileno: string;
  Address: string;
  City: string;
  Pincode: string;
  State: string;
  Fatheremailid: string;
  Motheremailid: string;
  LocalGuardianemailid: string;
  Fatheroccupation: string;
  Motheroccupation: string;
  Fatherqualification: string;
  Motherqualification: string;
  Class: string;
  Section: string;
  ExistingNumber: string;
  CreatedBy: string;
  ParentRecordExist: boolean;
  ClassDetailId: string;
  MobileNumbers: string;
  EmailIds: string;
  IsQuickRegistration: boolean;
  ProfileImageName: string;
}
