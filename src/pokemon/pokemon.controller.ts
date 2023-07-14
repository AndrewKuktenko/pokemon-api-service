import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RateLimiterGuard, RateLimit } from 'nestjs-rate-limiter';
import { PokemonService } from './pokemon.service';
import { ERateLimit } from 'src/common/enums/rate.limit.enum';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @RateLimit({
    keyPrefix: 'pokemon_call',
    points: ERateLimit.POINTS,
    duration: ERateLimit.SECONDS,
    customResponseSchema: () => {
      throw new HttpException(
        'Acceded rate limit.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    },
  })
  @UseGuards(RateLimiterGuard)
  @Get('/:nameOrId')
  async getPokemonByNameOrId(@Param('nameOrId') nameOrId: string) {
    return await this.pokemonService.getPokemonByNameOrId(nameOrId);
  }

  @RateLimit({
    keyPrefix: 'pokemon_call',
    points: ERateLimit.POINTS,
    duration: ERateLimit.SECONDS,
    customResponseSchema: () => {
      throw new HttpException(
        'Acceded rate limit.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    },
  })
  @UseGuards(RateLimiterGuard)
  @Get('/type/:typeOrId')
  async getPokemonListByType(@Param('typeOrId') typeOrId: string) {
    return await this.pokemonService.getPokemonListByType(typeOrId);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPokemonsFromFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.pokemonService.processFile(file);
  }
}
