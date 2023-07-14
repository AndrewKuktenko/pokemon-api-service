import { Pokemon } from 'src/common/models/pokemon.model';

interface IError {
  message: string;
  status: number;
}

export interface IUploadedPokemonsResult {
  pokemons: Pokemon[];
  errors: IError[];
}
