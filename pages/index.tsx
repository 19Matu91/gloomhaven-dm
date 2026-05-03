import { GetStaticProps } from "next";

import { getCharacter, getTitle } from "../common/utils";
import Layout from "../components/Layout";
import CharactersPage, { CharacterPageProps, characterSearchResults } from "../components/pages/CharactersPage";

const Characters = ({ searchResults }: CharacterPageProps) => {
  const character = getCharacter("jotl", "DE");

  return (
    <Layout title={getTitle("jotl", "Cartas")}>
      <CharactersPage character={character} game="jotl" searchResults={searchResults} />
    </Layout>
  );
};

export default Characters;

export const getStaticProps: GetStaticProps<CharacterPageProps> = async () => {
  const searchResults = characterSearchResults({ game: "jotl", character: "DE" });
  return { props: { searchResults } };
};
