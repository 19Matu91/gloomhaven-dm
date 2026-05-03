import { Game, Option } from "../common/types";

const baseRoutes: Option[] = [
  { id: "characters", name: "Characters" },
  { id: "items", name: "Items" },
  { id: "monsters", name: "Monsters" },
];

export const games: Game[] = [
  {
    id: "jotl",
    name: "Fauces del León",
    defaultClass: "DE",
    defaultMonster: "black-imp",
    routes: baseRoutes,
  },
];
