import { CampaignMessage } from "../interfaces/IIncomingMessage";
import { RabbitMQConnection } from "../connections/rabbittMQ/rabbitMQ";
import * as amqp from "amqplib";
import { processCampaignMessage } from "../services/processCampaignMessage";

export async function campaignConsumer(queueName: string): Promise<void> {
  let instance = RabbitMQConnection.getInstance();
  if (!instance.channel) {
    await instance.connect();
    instance = RabbitMQConnection.getInstance();
  }

  const channel: amqp.Channel | null = instance.channel;

  if (!channel) {
    return;
  }
  await channel.assertQueue(queueName, { durable: true });

  console.log(` RabbitMQ Connected. Listening on queue: ${queueName}`);

  channel.consume(
    queueName,
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
}
