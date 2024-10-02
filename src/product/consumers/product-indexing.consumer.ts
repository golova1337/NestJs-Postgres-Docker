import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Job } from 'bullmq';
import { MyLogger } from 'src/logger/logger.service';

@Processor('elastic')
export class ProductIndexingConsumer extends WorkerHost {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly logger: MyLogger,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'product-indexing': {
        return this.elasticsearchService.index({
          index: 'products',
          id: job.data.id,
          document: {
            name: job.data.name,
            desc: job.data.desc,
          },
        });
      }
      case 'product-updating': {
        const { id, name, desc } = job.data;
        return this.elasticsearchService.update({
          index: 'products',
          id: id,
          doc: { name: name, desc: desc },
        });
      }
      case 'product-removing': {
        const ids = job.data.ids;
        const body = ids.map((id) => {
          return { delete: { _index: 'products', _id: id } };
        });
        return this.elasticsearchService.bulk({
          refresh: true,
          operations: body,
        });
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
