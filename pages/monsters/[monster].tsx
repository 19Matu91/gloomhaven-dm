import { GetStaticPaths, GetStaticProps } from "next";

import { MonsterSearch } from "../../common/types";
import { getTitle } from "../../common/utils";
import Layout from "../../components/Layout";
import MonstersPage, { monsterSearchResults } from "../../components/pages/MonstersPage";
import { monsterCards } from "../../data/monster-cards";

type MonsterOnlyParams = { monster: string };

type PageProps = { searchResults: MonsterSearch };

const Monsters = ({ searchResults }: PageProps) => {
  const { monster } = searchResults;

  return (
    <Layout title={getTitle("jotl", monster?.name)}>
      <MonstersPage game="jotl" searchResults={searchResults} />
    </Layout>
  );
};

export default Monsters;

export const getStaticPaths: GetStaticPaths<MonsterOnlyParams> = async () => {
  return {
    fallback: false,
    paths: (monsterCards["jotl"] || []).map((monster) => ({
      params: { monster: monster.id },
    })),
  };
};

export const getStaticProps: GetStaticProps<PageProps, MonsterOnlyParams> = async (context) => {
  const { monster } = context.params;
  const searchResults = monsterSearchResults({ game: "jotl", monster });
  return { props: { searchResults } };
};
