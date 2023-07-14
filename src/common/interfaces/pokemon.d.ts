interface Ability {
  name: string;
  url: string;
}

interface Stat {
  name: string;
  url: string;
}

export interface PokemonAbilities {
  is_hidden: boolean;
  slot: number;
  ability: Ability;
}

export interface PokemonStats {
  base_stat: number;
  effort: number;
  stat: Stat;
}

export interface IPokemon {
  id: number;
  name: string;
  abilities: PokemonAbility[];
  stats: PokemonStats[];
}
