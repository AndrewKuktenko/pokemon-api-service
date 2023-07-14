import {
  IPokemonTypedList,
  IListedPokemon,
} from 'src/common/interfaces/pokemon.typed.list';

export class PokemonTypedList implements IPokemonTypedList {
  id: number;
  name: string;
  pokemon: IListedPokemon[];

  constructor(data: Partial<IPokemonTypedList>) {
    this.id = data.id;
    this.name = data.name;
    this.pokemon = data.pokemon;
  }
}
