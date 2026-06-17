import { Queue } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null
});

export type SendEmailJob = {
  email: string;
  subject:string
};


export const emailQueue = new Queue<SendEmailJob>("email", {
  connection: connection as any
});
