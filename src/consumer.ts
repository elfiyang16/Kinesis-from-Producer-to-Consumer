import {
  KinesisStreamEvent,
  KinesisStreamHandler,
  KinesisStreamRecord,
  KinesisStreamRecordPayload,
} from "aws-lambda";

// Placeholder: can put any other processing methods
const processMsgs = (msgs: Array<{ partitionKey: string; body: string }>) => {
  msgs.map(({ body }) => console.log("Get messages!", `${body}`));
};
const handler: KinesisStreamHandler = async (
  event: KinesisStreamEvent
): Promise<void> => {
  await Promise.all(
    event.Records.map(async (record: KinesisStreamRecord) => {
      const { data, partitionKey }: KinesisStreamRecordPayload = record.kinesis;
      const decodedMsgs = Buffer.from(data, "base64").toString("utf8");
      const msgs = decodedMsgs.split("-").map((msgJson) => {
        return {
          partitionKey,
          body: JSON.parse(msgJson),
        };
      });
      processMsgs(msgs);
    })
  );
};
export default handler;
