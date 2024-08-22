import { Module } from '@nestjs/common';
import { ElasticsearchService } from './services/elasticsearch.service';
import { ElasticsearchController } from './controllers/elasticsearch.controller';

@Module({
  providers: [ElasticsearchService],
  controllers: [ElasticsearchController],
})
export class ElasticsearchModule {}
