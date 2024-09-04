import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly elasticsearchService: SearchService) {}
  @Get()
  async search(@Query('q') query: string) {
    return this.elasticsearchService.searchProducts(query);
  }
}
