import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { getCharacter, getDescription, getTitle, verifyQueryParam } from "../../common/utils";
import Layout from "../../components/Layout";
import CharactersPage, { CharacterPageProps, characterSearchResults } from "../../components/pages/CharactersPage";
import { characters } from "../../data/characters";

type CharacterOnlyParams = { character: string };

const Characters = ({ searchResults }: CharacterPageProps) => {
  const router = useRouter();
  const characterClass = verifyQueryParam(router.query.character, "DE");
  const character = getCharacter("jotl", characterClass.toUpperCase());
  const name = character?.altName || character?.name || "Character";

  return (
    <Layout
      description={getDescription("jotl", "Cartas de Habilidad", searchResults.abilityCards)}
      title={getTitle("jotl", name + " Clase")}
    >
      <CharactersPage character={character} game="jotl" searchResults={searchResults} />
    </Layout>
  );
};

export default Characters;

export const getStaticPaths: GetStaticPaths<CharacterOnlyParams> = async () => {
  return {
    fallback: false,
    paths: characters
      .filter((c) => c.game === "jotl")
      .map((c) => ({ params: { character: c.class } })),
  };
};

export const getStaticProps: GetStaticProps<CharacterPageProps, CharacterOnlyParams> = async (context) => {
  const { character } = context.params;
  const searchResults = characterSearchResults({ game: "jotl", character });
  return { props: { searchResults } };
};
