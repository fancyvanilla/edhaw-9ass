export interface Location {
  city: string;
  region: string;
  postCode: string;
}

export interface Report {
  timestamp: string;
  timeCategory: "now" | "<1h" | ">1h";
  location: Location;
}

export type userReport = {
    report_time: string;
    location: Location
}

export type dbReport= {
    report_time: string;
    city: string;
    region: string;
    postCode: number;
}