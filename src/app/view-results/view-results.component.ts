import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-view-results",
  templateUrl: "./view-results.component.html",
  styleUrls: ["./view-results.component.scss"]
})
export class ViewResultsComponent implements OnInit {
  ResultByClasses: Array<any>;
  constructor() {}

  ngOnInit() {
    this.ResultByClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  ResetFilter() {}

  GetAdvanceFilter() {}
}
