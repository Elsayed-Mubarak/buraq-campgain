import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { payloadBuilder } from "./positionalPayloadBuilder";
import { IRawTemplateData } from "../interfaces/IRawTemplateData";

export async function fetchAndProcessCsv(
  csvUrl: string,
  templateData: IRawTemplateData
) {
  try {
    console.log("Fetching CSV file from URL:", csvUrl);

    const response = await axios.get(csvUrl, { responseType: "stream" });

    return new Promise<void>((resolve, reject) => {
      const rows: any[] = [];

      response.data
        .pipe(csv())
        .on("data", (row: any) => rows.push(row))
        .on("end", async () => {
          if (rows.length === 0) {
            reject("⚠️ No data found in CSV file!");
            return;
          }

          console.log(" Starting New CSV Batch...");

          const templateName = templateData.name;
          const language = templateData.language;
          //   const payload = payloadService.generateScopedPayload(
          //     templateName,
          //     language
          //   );

          //   console.log(" Unified Payload for Batch:", payload);

          //  Process each row with the same payload
          for (const row of rows) {
            // console.log(` Sending to ${row.PhoneNumber} with Payload`, payload);
            // await sendMessageToWhatsApp(row.PhoneNumber, payload);
          }

          // Reset payload after batch processing
          payloadBuilder.resetPayload();
          console.log(" Payload reset. Ready for next batch.");

          resolve();
        })
        .on("error", reject);
    });
  } catch (error: any) {
    console.error(" Error fetching CSV:", error.message);
  }
}
