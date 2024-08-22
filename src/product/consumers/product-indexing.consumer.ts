import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Client } from '@elastic/elasticsearch';
import { EmojiLogger } from 'src/common/logger/emojiLogger';

@Processor('elastic')
export class ProductIndexingConsumer extends WorkerHost {
  logger = new EmojiLogger();

  client = new Client({ node: process.env.ELASTICSEARCH_HOST });
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'product-indexing': {
        const result = await this.client.index({
          index: 'products',
          id: job.data.id,
          document: {
            name: job.data.name,
            desc: job.data.desc,
          },
        });
        return {};
      }
      case 'product-removing': {
        const ids = job.data.ids;
        const body = ids.map((id) => {
          return { delete: { _index: 'products', _id: id } };
        });
        const result = await this.client.bulk({
          refresh: true,
          operations: body,
        });
        return {};
      }
      case 'product-updating': {
        const { id, name, desc } = job.data;
        const result = await this.client.update({
          index: 'products',
          id: id,
          doc: { name: name, desc: desc },
        });
        return {};
      }
    }
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job<any, any, string>, result, prev: string) {
    this.logger.log(`Job with ID ${(job.name, job.id)} completed.`);
    this.logger.log(`Result: ${result}`);

    if (prev) {
      console.log(`Previous state: ${prev}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<any, any, string>, error, prev: string) {
    this.logger.error(`Job with ID ${(job.name, job.id)} failed.`);
    this.logger.error(`Error: ${error} .`);
  }
}
