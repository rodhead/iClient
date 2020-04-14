import {
  IsValidString,
  IsValidTime,
  IsValidType,
} from "src/providers/common-service/common.service";
import { FormArray, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { AjaxService } from "./../../providers/ajax.service";
import { CommonService } from "./../../providers/common-service/common.service";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import {
  DefaultUserImage,
  ServerError,
  SuccessMessage,
} from "src/providers/constants";
import * as $ from "jquery";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  IsClassRoomReady: boolean;
  EmptyMessage: string;
  EquipmentSetting: FormGroup;
  ZoneForm: FormGroup;
  RoomCounts: number;
  FacultyImage: any;
  CurrentSection: any;
  ZoneDetail: Array<Zone>;
  IsZoneReady: boolean;
  ManageSettingForm: Array<ManageEquipmentModal>;
  constructor(
    private commonService: CommonService,
    private http: AjaxService,
    private fb: FormBuilder
  ) {
    this.FacultyImage = DefaultUserImage;
  }

  ngOnInit(): void {
    this.IsZoneReady = false;
    this.ZoneDetail = [];
    this.CurrentSection = $("#zone");
    this.ManageSettingForm = [];
    this.IsClassRoomReady = false;
    this.EmptyMessage =
      "Enter no.# of total rooms available, including toilet bathroom office etc.";
    this.LoadZone();
    this.BuildSettingForm();
  }

  LoadZone() {
    this.http.get("Setting/GetZone").then((result) => {
      if (IsValidString(result.ResponseBody)) {
        let Data = JSON.parse(result.ResponseBody).Table;
        if (IsValidType(Data)) {
          this.ZoneDetail = [];
          this.ZoneDetail = Data;
          this.BuildZone();
          this.IsZoneReady = true;
        }
        this.commonService.ShowToast(SuccessMessage);
      } else {
        this.ZoneDetail = [];
        this.ZoneDetail.push(new Zone());
        this.BuildZone();
        this.IsZoneReady = true;
        this.commonService.ShowToast("No zone found.");
      }
    });
  }

  SelectSection(Type: string) {
    if (Type === "Zone") {
      this.CurrentSection = $("#zone");
    } else if (Type === "Store") {
      this.CurrentSection = $("#store");
    } else if (Type === "ClassRoom") {
      this.CurrentSection = $("#classroom");
    } else if (Type === "Sports") {
      this.CurrentSection = $("#sports");
    }
  }

  GetSettingCollection(): FormArray {
    let Data = this.EquipmentSetting.get("EquipmentDetail") as FormArray;
    return Data;
  }

  GetZoneNames(): FormArray {
    return this.ZoneForm.get("Zones") as FormArray;
  }

  AddZone() {
    let ZoneArray: FormArray = this.ZoneForm.get("Zones") as FormArray;
    ZoneArray.push(
      this.fb.group({
        ZoneName: new FormControl("", Validators.required),
        ZoneDescription: new FormControl("", Validators.required),
      })
    );
    return ZoneArray;
  }

  BuildZone() {
    this.ZoneForm = this.fb.group({
      Zones: this.fb.array(this.BuildZoneArray()),
    });
  }

  BuildZoneArray(): Array<FormGroup> {
    let Data: Array<FormGroup> = [];
    let index = 0;
    while (index < this.ZoneDetail.length) {
      Data.push(
        this.fb.group({
          ZoneName: new FormControl(
            this.ZoneDetail[index].ZoneName,
            Validators.required
          ),
          ZoneDescription: new FormControl(
            this.ZoneDetail[index].ZoneDescription,
            Validators.required
          ),
        })
      );
      index++;
    }

    return Data;
  }

  BuildSettingForm() {
    this.EquipmentSetting = this.fb.group({
      EquipmentDetail: this.fb.array(this.BindDataArray()),
    });
  }

  AddRows() {
    if (this.RoomCounts > 0) {
      let index = 0;
      this.ManageSettingForm = [];
      while (index < this.RoomCounts) {
        this.ManageSettingForm.push(new ManageEquipmentModal());
        index++;
      }
      this.BuildSettingForm();
    }
  }

  BindDataArray(): Array<FormGroup> {
    let SettingData: Array<FormGroup> = [];
    let index = 0;
    if (this.ManageSettingForm.length > 0) {
      while (index < this.ManageSettingForm.length) {
        SettingData.push(
          this.BindSettingCollectionData(this.ManageSettingForm[index])
        );
        index++;
      }
      this.IsClassRoomReady = true;
    }
    return SettingData;
  }

  BindSettingCollectionData(Data: ManageEquipmentModal) {
    return this.fb.group({
      EquipmentUid: new FormControl(Data.EquipmentUid),
      EquipmentDetailUid: new FormControl(Data.EquipmentDetailUid),
      RoomNumber: new FormControl(Data.RoomNumber),
      ItemName: new FormControl(Data.ItemName),
      ItemDescription: new FormControl(Data.ItemDescription),
      Quantity: new FormControl(Data.Quantity),
      PricePerItem: new FormControl(Data.PricePerItem),
      PurchaseUid: new FormControl(Data.PurchaseUid),
      ZoneUid: new FormControl(Data.ZoneUid),
    });
  }

  SaveZones() {
    let Data = this.ZoneForm.controls.Zones as FormArray;
    let index = 0;
    while (index < Data.length) {
      if (!Data.at(index).get("ZoneName").valid) {
        this.CurrentSection.find(`div[name="zone-${index}"] > input`).addClass(
          "error-field"
        );
      }
      index++;
    }

    this.http.post("Setting/CreateZone", Data.value).then((result) => {
      if (IsValidString(result.ResponseBody)) {
        this.commonService.ShowToast(SuccessMessage);
      } else {
        this.commonService.ShowToast(ServerError);
      }
    });
  }
}

class ManageEquipmentModal {
  EquipmentUid: number = null;
  EquipmentDetailUid: number = null;
  RoomNumber: number;
  ItemName: string = "";
  ItemDescription: string = "";
  Quantity: number = null;
  PricePerItem: number = null;
  PurchaseUid: number = null;
  ZoneUid: number = null;
}

class Zone {
  ZoneUid: number = null;
  ZoneName: string = null;
  ZoneDescription: string = null;
}
