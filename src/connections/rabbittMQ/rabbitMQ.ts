import amqp from "amqplib";
import dotenv from "dotenv";
import { CampaignMessage } from "../../interfaces/IIncomingMessage";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || "campaigns_queue";

export class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private isConnected = false;
  public connection: amqp.Connection | null = null;
  public channel: amqp.Channel | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQConnection {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
    }
    return RabbitMQConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("RabbitMQ already connected.");
      return;
    }

    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("RabbitMQ Connection Failed:", error);
      process.exit(1);
    }
  }
}

// export default RabbitMQConnection;
