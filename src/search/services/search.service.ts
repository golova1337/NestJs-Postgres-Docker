import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly indexName = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    await this.createIndexIfNotExists();
  }

  private async createIndexIfNotExists() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: this.indexName,
    });

    if (!indexExists) {
      const response = await this.elasticsearchService.indices.create({
        index: this.indexName,
        body: {
          settings: {
            max_ngram_diff: 19,
            analysis: {
              analyzer: {
                std_folded: {
                  type: 'custom',
                  tokenizer: 'ngram_tokenizer',
                  filter: ['lowercase', 'asciifolding'],
                },
              },
              tokenizer: {
                ngram_tokenizer: {
                  type: 'ngram',
                  min_gram: 2,
                  max_gram: 20,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'std_folded',
              },
              desc: {
                type: 'text',
                analyzer: 'std_folded',
              },
            },
          },
        },
      });

      console.log(`Index ${this.indexName} created.`);
    } else {
      console.log(`Index ${this.indexName} already exists.`);
    }
  }

  async searchProducts(query: string) {
    const response = await this.elasticsearchService.search({
      index: this.indexName,
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  name: {
                    query: query,
                    analyzer: 'std_folded',
                  },
                },
              },
              {
                match: {
                  desc: {
                    query: query,
                    analyzer: 'std_folded',
                  },
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      },
    });
    return response;
  }
}
