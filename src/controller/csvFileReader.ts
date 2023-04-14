import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

type publicHoliday = {
  id: number;
  date: number;
  name: string;
  information: string;
  moreInformation: string;
  jurisdiction: string;
}

export const readCSVFile = (filepath: string) => {

  const csvFilePath = path.resolve(__dirname, filepath);
  const headers = ['id', 'date', 'name', 'information', 'moreInformation', 'jusrisdiction'];
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(fileContent, {
    delimiter: ',',
    columns: headers,
  }, (error, result: publicHoliday[]) => {
    if (error) {
      console.error(error);
    }

    console.log("Result", result);
  })
}

