import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchProductsQuery } from '../impl/search.query';

@QueryHandler(SearchProductsQuery)
export class SearchProductsQueryHandler
  implements IQueryHandler<SearchProductsQuery>
{
  private readonly indexName = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async execute(command: SearchProductsQuery) {
    const { query } = command;
    return this.elasticsearchService.search({
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
  }
}
