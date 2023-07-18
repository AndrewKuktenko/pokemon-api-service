import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaginationMiddleware } from 'src/common/middleware/pagination.middleware';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [HttpModule, RateLimiterModule],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: 'pokemon', method: RequestMethod.GET });
  }
}
