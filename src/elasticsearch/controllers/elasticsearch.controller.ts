import { Controller, Get, Query } from '@nestjs/common';
import { ElasticsearchService } from '../services/elasticsearch.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  @Get()
  async search(@Query('q') query: string) {
    return this.elasticsearchService.searchProducts(query);
  }
}
