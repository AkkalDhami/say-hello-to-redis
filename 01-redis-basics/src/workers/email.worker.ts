import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { sendMail } from "../utils/send-mail";
import { SendEmailJob } from "../queues/email.queue";

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null
});

new Worker<SendEmailJob>(
  "email",
  async (job) => {
    console.log("job started..");
    const email = job.data?.email;

    console.log("job processing:", job.data);

    await sendMail(email);
    console.log("job completed..");
  },
  {
    connection: connection as any
  }
);
