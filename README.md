#### Kinesis Playground

Simple Producer-Consumer pattern with Kinesis Data Streams

_Kinesis Data Streams is part of the Kinesis streaming data platform, along with Kinesis Data Firehose, Kinesis Video Streams, and Kinesis Data Analytics._

##### Terminologies

Kinesis Data Stream
A Kinesis data stream is a set of shards. Each shard has a sequence of data records. Each data record has a sequence number that is assigned by Kinesis Data Streams.

Data Record
A data record is the unit of data stored in a Kinesis data stream. Data records are composed of a sequence number, a partition key, and a data blob, which is an immutable sequence of bytes. A data blob can be up to 1 MB.

Capacity Mode
On-demand mode and a provisioned mode

Retention Period
Default to 24 hours up to 365 days

Shard
A shard is a uniquely identified sequence of data records in a stream. A stream is composed of one or more shards. Each shard can support up to 5 transactions per second for reads, up to a maximum total data read rate of 2 MB per second and up to 1,000 records per second for writes, up to a maximum total data write rate of 1 MB per second (including partition keys).

Partition Key
A partition key is used to group data by shard within a stream.

Sequence Number
Each data record has a sequence number that is unique per partition-key within its shard.

#### Deploy

`sls deploy`
