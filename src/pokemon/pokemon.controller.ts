import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('/:nameOrId')
  async getPokemonByNameOrId(@Param('nameOrId') nameOrId: string) {
    return await this.pokemonService.getPokemonByNameOrId(nameOrId);
  }

  @Get('/type/:typeOrId')
  async getPokemonListByType(@Param('typeOrId') typeOrId: string) {
    return await this.pokemonService.getPokemonListByType(typeOrId);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPokemonsFromFile(@UploadedFile() file: Express.Multer.File) {
    return await this.pokemonService.processFile(file);
  }
}
