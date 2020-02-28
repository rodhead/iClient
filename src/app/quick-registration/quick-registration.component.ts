import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-quick-registration",
  templateUrl: "./quick-registration.component.html",
  styleUrls: ["./quick-registration.component.sass"]
})
export class QuickRegistrationComponent implements OnInit {
  studForm: any;
  IsUpdating: boolean;
  IsExistingParent: boolean;
  constructor() {}

  ngOnInit() {}

  getImage() {}

  findParent() {}
}
