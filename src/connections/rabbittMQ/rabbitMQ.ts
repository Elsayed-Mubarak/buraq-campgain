import amqp from "amqplib";
import dotenv from "dotenv";
import { processCampaignMessage } from "../../consumers/campaignConsumer";
import { CampaignMessage } from "../../interfaces/IIncomingMessage";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || "campaigns_queue";

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(` RabbitMQ Connected. Listening on queue: ${QUEUE_NAME}`);

    channel.consume(
      QUEUE_NAME,
      async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          try {
            //  Parse the message content (RabbitMQ messages are Buffers)
            const messageContent: CampaignMessage = JSON.parse(
              msg.content.toString()
            );

            console.log(`Received cmpaign:`, messageContent);
            await processCampaignMessage(messageContent);
            channel.ack(msg);
          } catch (error) {
            console.error(" Error processing message:", error);
            channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false } // Manual Acknowledgment Mode
    );
  } catch (error) {
    console.error(" RabbitMQ Connection Failed:", error);
  }
}
