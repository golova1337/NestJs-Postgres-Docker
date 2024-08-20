import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;

  constructor() {
    this.client = new Client({ node: process.env.ELASTICSEARCH_HOST });
  }

  async onModuleInit() {
    await this.createIndexIfNotExists();
  }

  private async createIndexIfNotExists() {
    const indexName = 'products';

    const indexExists = await this.client.indices.exists({
      index: indexName,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: indexName,
        body: {
          settings: {
            analysis: {
              analyzer: {
                custom_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
              },
            },
          },
        },
      });
      console.log(`Index ${indexName} created.`);
    } else {
      console.log(`Index ${indexName} already exists.`);
    }
  }
}
