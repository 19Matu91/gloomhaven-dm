import { Game, Option } from "../common/types";

const baseRoutes: Option[] = [
  { id: "characters", name: "Characters" },
  { id: "items", name: "Items" },
  { id: "monsters", name: "Monsters" },
];

export const games: Game[] = [
  {
    id: "jotl",
    name: "Jaws of the Lion",
    defaultClass: "DE",
    defaultMonster: "black-imp",
    routes: baseRoutes,
  },
];
