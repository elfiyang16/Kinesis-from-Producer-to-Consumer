import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayEvent,
  Context,
} from "aws-lambda";
import Kinesis from "aws-sdk/clients/kinesis";
import { v4 as uuidv4 } from "uuid";

const kinesis = new Kinesis({
  region: process.env.AWS_REGION || "eu-west-1",
  apiVersion: "2013-12-02",
});
const STREAM_NAME = "Test_Stream";

const chunksplit = <T extends Array<string>>(
  msgs: T,
  size: number = 500
): Array<T> => {
  const partitions = [];
  let idx = 0;
  for (let i = 0; i <= msgs.length; i += size) {
    const upperbound = Math.min(i + size, msgs.length);
    partitions.push(msgs.slice(idx, upperbound));
  }
  return partitions;
};

// Assuming Event body is an array of strings (msgs)
const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let statusCode = 200;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No msg body found",
      }),
    };
  }

  const msgs = event.body as any as string[];

  const groupedPartitions = chunksplit(msgs)
    .map((partition) => partition.join("-"))
    .map((blob, i) => {
      return {
        Data: Buffer.from(JSON.stringify(blob), "utf-8"),
        PartitionKey: `${uuidv4()}-${i}`,
      };
    });

  const res = await Promise.all(
    groupedPartitions.map(async (partition) => {
      return await kinesis
        .putRecord({
          StreamName: STREAM_NAME,
          ...partition,
        })
        .promise();
    })
  );

  return {
    statusCode,
    body: JSON.stringify({
      message: "Sent msg to Kinesis",
      content: res,
    }),
  };
};

export default handler;
