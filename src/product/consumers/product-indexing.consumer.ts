import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Client } from '@elastic/elasticsearch';

@Processor('product-indexing')
export class ProductIndexingConsumer extends WorkerHost {
  client = new Client({ node: process.env.ELASTICSEARCH_HOST });
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'product-indexing-elastic': {
        try {
          const result = await this.client.index({
            index: 'products',
            id: job.data.id,
            document: {
              name: job.data.name,
              desc: job.data.desc,
            },
          });

          return {};
        } catch (error) {
          console.error('Job failed:', error);
          throw error; 
        }
      }
    }
  }
}
