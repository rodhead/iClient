import { IColumns } from "./Generic/Interface/IColumns";

export const ViewClasses = "viewclasses";
export const VehicleLocation = "vehiclelocation";
export const UploadData = "uploaddata";
export const TrackOnMap = "trackonmap";
export const TimeTable = "timetable";
export const Subjects = "subjects";
export const StudentRegistration = "studentregistration";
export const StaffRegistration = "staffregistration";
export const ExamResult = "examresult";
export const QuickRegistration = "quickregistration";
export const Projects = "projects";
export const StaffMemberRegistration = "staffmemberregistration";
export const FacultyRegistration = "FacultyRegistration";
export const Dashboard = "dashboard";
export const Contacts = "contacts";
export const Calendar = "calendar";
export const Attendence = "attendence";
export const DefaultUserImage = "assets/defaultuser.jpg";

export const StudentReports = "studentsreport";
export const FacultyReports = "facultiesreport";
export const StaffReports = "staffreport";
export const ManageTimetable = "managetimetable";
export const ManageUser = "manageuser";
export const Roles = "roles";
export const ZerothIndex = 0;
export const ServerError = "Server error occured. Please contact to admin.";
export const InvalidData = "Invalid data received. Please contact to admin.";
export const OperationFail =
  "Fail to perform operation. Please contact to admin.";

export const PurchaseColumn: Array<IColumns> = [
  { column: "Name", header: "Product", width: 10 },
  { column: "BillNo", header: "Customer" },
  { column: "PurchaseItemUid", type: "hidden" },
  { column: "Quantity", header: "Qtn #" },
  { column: "Price", header: "SNo #" },
  { column: "TotalPrice", header: "Total" },
  { column: "AmountPaid", header: "Paid" },
  { column: "AmountDue", header: "Due" }
];

export const StudentsColumn: Array<IColumns> = [
  { column: "rollno", header: "Roll No.#" },
  { column: "studentUid", type: "hidden" },
  { column: "FName", header: "Student Name" },
  { column: "mobilenumber", header: "Mob. No.#" },
  { column: "ClassSection", header: "Class/Sec" },
  { column: "emailId", header: "Email Id" },
  { column: "registrationno", header: "Reg. No.#" }
];

export const SubjectColumn: Array<IColumns> = [
  { column: "SubjectId", type: "hidden" },
  { column: "SubjectName", header: "Subject Name" },
  { column: "SubjectCode", header: "Subject Code" },
  { column: "SubjectCredit", header: "Credit" }
];

export const FacultyColumn: Array<IColumns> = [
  { column: "StaffMemberUid", type: "hidden" },
  { column: "FName", header: "Faculty Name" },
  { column: "MobileNumber", header: "Mob. No.#" },
  { column: "Class", header: "Class" },
  { column: "Section", header: "Sec" },
  { column: "Email", header: "Email Id" }
];

export const StaffMemberColumn: Array<IColumns> = [
  { column: "Index", header: "SNo.#" },
  { column: "StaffMemberUid", type: "hidden" },
  { column: "FName", header: "Faculty Name" },
  { column: "MobileNumber", header: "Mob. No.#" },
  { column: "Description", header: "Desc" },
  { column: "Email", header: "Email Id" }
];
