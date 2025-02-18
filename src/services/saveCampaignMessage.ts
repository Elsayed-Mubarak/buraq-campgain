import campaignMessages from "../models/campaignMessages";

export async function saveCampaignMessage(
  campaignId: string,
  messageId: string,
  messageStatus: string
): Promise<void> {
  try {
    // Create a new campaign message instance
    console.log("before saving", campaignId, messageId, messageStatus);
    const newMessage = new campaignMessages({
      campaignId: campaignId,
      messageId: messageId,
      messageStatus: messageStatus,
      createdAt: new Date(), // Current timestamp
    });

    // Save to the database
    await newMessage.save();
    console.log("Campaign message saved successfully.");
  } catch (error) {
    console.error("Error saving campaign message:", error);
  }
}
