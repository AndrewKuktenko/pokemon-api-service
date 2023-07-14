import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Express } from 'express';
import Papa from 'papaparse';
import { createReadStream } from 'fs';
import { IPokemon } from 'src/common/interfaces/pokemon';
import { Pokemon } from 'src/common/models/pokemon.model';
import { IPokemonTypedList } from 'src/common/interfaces/pokemon.typed.list';
import { PokemonTypedList } from 'src/common/models/pokemon.typed.list.model';

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  async getPokemonByNameOrId(nameOrId: string): Promise<Pokemon> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get<IPokemon>(
          `${process.env.POKEMON_API_URL}/pokemon/${nameOrId.toLowerCase()}/`,
        ),
      );

      return new Pokemon(data);
    } catch (e) {
      if (e?.response?.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          'No Pokemon with this id or name.',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to get Pokemon.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPokemonListByType(typeOrId: string) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get<IPokemonTypedList>(
          `${process.env.POKEMON_API_URL}/type/${typeOrId.toLowerCase()}/`,
        ),
      );

      return new PokemonTypedList(data);
    } catch (e) {
      if (e?.response?.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          'No Pokemon type with this id or name.',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to get Pokemon list by type.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processFile(file: Express.Multer.File) {
    const fileStream = createReadStream(file.path, 'utf-8');

    // TODO: add CSV parsing
  }
}
