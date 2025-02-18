import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";
import { positonalPayloadBuilder } from "./positionalPayloadBuilder";
import { IRawTemplateData } from "../interfaces/IRawTemplateData";
import { replaceTemplateValues } from "./finalPayload";
import { IWhatsAppConfig } from "../models/whatsAppConfig";
import { saveCampaignMessage } from "./saveCampaignMessage";
import { messageQueue } from "../queus/messageQueue";

export async function fetchAndProcessCsv(
  csvUrl: string,
  templateData: IRawTemplateData,
  whatsApp: IWhatsAppConfig,
  campaignId: string
) {
  try {
    console.log("Fetching CSV file from URL:", csvUrl);

    const response = await axios.get(csvUrl, { responseType: "stream" });

    return new Promise<void>((resolve, reject) => {
      const rows: any[] = [];

      response.data
        .pipe(csv())
        .on("data", (row: any) => {
          // Push row directly without predefined keys
          rows.push(row);
        })
        .on("end", async () => {
          if (rows.length === 0) {
            console.log(" No data found in CSV file!");
            return;
          }

          const templateName = templateData.name;
          const language = templateData.language;
          const payload =
            positonalPayloadBuilder.generateScopedPayload(templateData);

          console.log("Processed CSV Data:");
          rows.forEach(async (row, index) => {
            // await messageQueue.add("sendMessage", {
            //   campaignId,
            //   rowData: row,
            //   whatsApp,
            //   payload,
            // });
            const finalPayload = replaceTemplateValues(payload, row);
            console.log(
              "\nTemplate Request Payload:",
              whatsApp.phoneNumberId,
              whatsApp.apiToken
            );
            const url = `https://graph.facebook.com/v18.0/${whatsApp.phoneNumberId}/messages`;

            const headers = {
              Authorization: `Bearer ${whatsApp.apiToken}`,
              "Content-Type": "application/json",
            };

            const response = await axios.post(url, finalPayload, { headers });
            if (response.status === 200) {
              await saveCampaignMessage(
                campaignId,
                response.data.messages[0].id,
                response.data.messages[0].message_status
              );
            }

            console.log(JSON.stringify(response.data, null, 2));
            return response.data;
          });
          //   positonalPayloadBuilder.resetPayload();
          console.log(" Payload reset. Ready for next batch.");

          resolve();
        })
        .on("error", reject);
    });
  } catch (error: any) {
    console.error(" Error fetching CSV:", error.message);
  }
}
