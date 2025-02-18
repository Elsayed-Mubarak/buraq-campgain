import axios from "axios";
import { Worker } from "bullmq";
import { redisClient } from "../connections/redis/redis";
import { replaceTemplateValues } from "../services/finalPayload";
import { saveCampaignMessage } from "../services/saveCampaignMessage";

// Worker to process queued messages
const messageWorker = new Worker(
  "messageQueue",
  async (job) => {
    const { campaignId, rowData, whatsApp, payload } = job.data;
    const finalPayload = replaceTemplateValues(payload, rowData);

    console.log(`Sending message to ${rowData.PhoneNumber}`);

    const url = `https://graph.facebook.com/v18.0/${whatsApp.phoneNumberId}/messages`;
    const headers = {
      Authorization: `Bearer ${whatsApp.apiToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(url, finalPayload, { headers });

      if (response.status === 200) {
        await saveCampaignMessage(
          campaignId,
          response.data.messages[0].id,
          response.data.messages[0].message_status
        );
      }

      console.log(" Message Sent Successfully:", response.data);
    } catch (error) {
      console.error(" Failed to Send Message:", error);
    }
  },
  { connection: redisClient }
);

console.log(" Message Worker Started...");
