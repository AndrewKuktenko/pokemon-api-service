interface IPokemon {
  name: string;
  url: string;
}

export interface IListedPokemon {
  slot: number;
  pokemon: IPokemon;
}

export interface IPokemonTypedList {
  id: number;
  name: string;
  pokemon: IListedPokemon[];
}
