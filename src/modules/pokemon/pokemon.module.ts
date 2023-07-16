import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [HttpModule, RateLimiterModule],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
