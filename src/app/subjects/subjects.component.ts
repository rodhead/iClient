import { Component, OnInit } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { SearchModal } from "../student-report/student-report.component";
import { AjaxService } from "src/providers/ajax.service";
import {
  CommonService,
  IsValidType
} from "src/providers/common-service/common.service";
import { iNavigation } from "src/providers/iNavigation";
import * as $ from "jquery";
import { StudentsColumn, SubjectColumn } from "src/providers/constants";

@Component({
  selector: "app-subjects",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"]
})
export class SubjectsComponent implements OnInit {
  DynamicTableDetail: ITable;
  Pagination: [];
  CurrentPageIndex: any;
  Headers: Array<string>;
  GridData: ITable;
  SearchQuery: SearchModal;
  constructor(
    private http: AjaxService,
    private commonService: CommonService,
    private nav: iNavigation
  ) {}

  ngOnInit() {
    this.InitQuery();
    this.LoadData();
  }

  InitQuery() {
    this.SearchQuery = {
      SearchString: " 1=1 ",
      SortBy: "",
      PageIndex: 1,
      PageSize: 15
    };
  }

  LoadData() {
    this.SearchQuery.SearchString = " 1=1 ";
    this.SearchQuery.SortBy = "";
    this.SearchQuery.PageIndex = 1;
    this.SearchQuery.PageSize = 15;

    this.http.post("Events/AllSubjects", this.SearchQuery).then(response => {
      if (IsValidType(response.ResponseBody)) {
        let Data = JSON.parse(response.ResponseBody);
        let Keys = Object.keys(Data);
        if (Keys.indexOf("Table") !== -1 && Keys.indexOf("Table1") !== -1) {
          let GridRowData = Data["Table"];
          let TotalCount = Data["Table1"][0].Total;
          this.GridData = {
            headers: SubjectColumn,
            rows: GridRowData,
            totalCount: TotalCount,
            pageIndex: this.SearchQuery.PageIndex,
            pageSize: this.SearchQuery.PageSize,
            url: ""
          };
        } else {
          this.commonService.ShowToast(
            "Receive invalid data. Please contact to admin."
          );
        }
      } else {
        this.commonService.ShowToast("Server error. Please contact to admin.");
      }
    });
  }

  OnEdit($e: any) {}

  OnDelete($e: any) {}

  NextPage($e: any) {}

  PreviousPage($e: any) {}

  FilterLocaldata() {}

  ResetFilter() {}

  GetAdvanceFilter() {}
}

export interface SubjectModal {
  SubjectId: string;
  SubjectName: string;
  SubjectCode: number;
  SubjectCredit: number;
}
