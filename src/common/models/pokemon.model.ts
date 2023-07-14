import {
  IPokemon,
  PokemonAbilities,
  PokemonStats,
} from 'src/common/interfaces/pokemon';

export class Pokemon implements IPokemon {
  id: number;
  name: string;
  abilities: PokemonAbilities[];
  stats: PokemonStats[];

  constructor(data: Partial<IPokemon>) {
    this.id = data.id;
    this.name = data.name;
    this.abilities = data.abilities;
    this.stats = data.stats;
  }
}
