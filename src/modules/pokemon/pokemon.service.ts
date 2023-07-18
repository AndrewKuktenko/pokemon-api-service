import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ParseResult, parse } from 'papaparse';
import { Readable } from 'stream';
import { IPokemon } from 'src/common/interfaces/pokemon';
import {
  IPokemonList,
  IPokemonListResult,
} from 'src/common/interfaces/pokemon.list';
import { IPagination } from 'src/common/interfaces/pagination';
import { Pokemon } from 'src/common/models/pokemon.model';
import { IPokemonTypedList } from 'src/common/interfaces/pokemon.typed.list';
import { PokemonTypedList } from 'src/common/models/pokemon.typed.list.model';
import { IUploadedPokemonsResult } from 'src/common/interfaces/uploaded.pokemon.result';
import { cleanString } from 'src/common/helpers/string.operations';

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  private readonly TOTAL_POKEMONS = 151;

  async getPokemonByNameOrId(nameOrId: string): Promise<Pokemon> {
    const param = cleanString(nameOrId.toLowerCase());

    if (!param)
      throw new HttpException(
        'Name or ID cannot be empty.',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<IPokemon>(
          `${process.env.POKEMON_API_URL}/pokemon/${param}`,
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
    const param = cleanString(typeOrId.toLowerCase());

    if (!param)
      throw new HttpException(
        'Type or ID cannot be empty.',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<IPokemonTypedList>(
          `${process.env.POKEMON_API_URL}/type/${param}/`,
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

  async processFile(
    file: Express.Multer.File,
  ): Promise<IUploadedPokemonsResult> {
    const fileStream = Readable.from(file.buffer);

    try {
      return await new Promise((resolve, reject) => {
        const onData = async (results: ParseResult<Record<string, string>>) => {
          const { data, meta } = results;
          const key: string = meta.fields[0];
          if (key && data.length > 0) {
            if (data.length > 20) {
              reject(HttpStatus.PAYLOAD_TOO_LARGE);
            }

            const promises: Promise<Pokemon>[] = [];
            const pokemonData: Pokemon[] = [];
            const errors = [];

            for (const row of data) {
              const name: string = row[key];
              if (name) promises.push(this.getPokemonByNameOrId(name));
            }

            const settledResult = await Promise.allSettled(promises);

            for (const result of settledResult) {
              if (result.status === 'fulfilled') {
                pokemonData.push(result.value);
              } else {
                errors.push({
                  message: result.reason?.message,
                  status: result.reason?.status,
                });
              }
            }

            resolve({ pokemons: pokemonData, errors });
          }
        };

        parse(fileStream, {
          header: true,
          skipEmptyLines: true,
          complete: onData,
          error: (e) => reject(e),
        });
      });
    } catch (e) {
      if (e === HttpStatus.PAYLOAD_TOO_LARGE) {
        throw new HttpException(
          'File is too big. Max 20 rows.',
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }

      throw new HttpException(
        'Failed to upload file.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPokemonList(pagination: IPagination): Promise<IPokemonListResult> {
    let offset = pagination.pageSize * (pagination.pageNumber - 1);
    const limit = pagination.pageSize;

    if (offset + limit > this.TOTAL_POKEMONS) {
      offset = this.TOTAL_POKEMONS - limit;
    }

    try {
      const { data } = await lastValueFrom(
        this.httpService.get<IPokemonList>(
          `${process.env.POKEMON_API_URL}/pokemon/?limit=${limit}&offset=${offset}`,
        ),
      );

      return { data: data.results, totalItems: this.TOTAL_POKEMONS };
    } catch (e) {
      throw new HttpException(
        'Failed to get Pokemons list.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
