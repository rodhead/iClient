import { Component, OnInit, Input } from "@angular/core";
import { ITable } from "src/providers/Generic/Interface/ITable";
import { IColumns } from "src/providers/Generic/Interface/IColumns";
import {
  IsValidType,
  CommonService
} from "src/providers/common-service/common.service";

@Component({
  selector: "app-dynamic-grid",
  templateUrl: "./dynamic-grid.component.html",
  styleUrls: ["./dynamic-grid.component.scss"]
})
export class DynamicGridComponent implements OnInit {
  IsEmptyRow: boolean = false;
  TotalHeaders: number = 0;
  GridData: any;
  TableRows: any;
  Headers: Array<IColumns>;
  IsStriped: boolean = true;
  pageIndex: number = 0;
  TotalPageCount: number = 0;
  constructor(private commonService: CommonService) {}

  @Input()
  set Data(Data: ITable) {
    if (IsValidType(Data)) {
      let cols = Object.keys(Data);
      if (cols.indexOf("headers") === -1 || cols.indexOf("rows") === -1) {
        this.commonService.ShowToast(
          "Object required [headers and rows] fields."
        );
      } else {
        this.GridData = Data["rows"];
        this.Headers = Data["headers"];
        if (
          Data["totalCount"] !== null &&
          Data["pageSize"] !== null &&
          Data["pageIndex"] !== null
        ) {
          let TotalRecordCount = Data["totalCount"];
          let pageSize = Data["pageSize"];
          this.pageIndex = Data["pageIndex"];
          if (TotalRecordCount > 0) {
            try {
              this.TotalPageCount = parseInt(
                (TotalRecordCount / pageSize).toString()
              );
              if (TotalRecordCount % pageSize > 0) {
                this.TotalPageCount++;
              }
            } catch (e) {
              this.commonService.ShowToast(
                "Invalid record count and pagesize passed."
              );
            }
          }
        }
        let TotalHeaders = this.Headers.filter(x => x.type !== "hidden").length;
      }
    }
  }

  @Input()
  set Stripe(isStripe: boolean) {
    if (IsValidType(isStripe)) {
      this.IsStriped = isStripe;
    } else {
      this.IsStriped = false;
    }
  }

  ngOnInit(): void {}

  PreviousPage() {}

  NextPage() {}
}
