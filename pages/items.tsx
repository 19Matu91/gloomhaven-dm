import { GetStaticProps } from "next";
import { ChangeEvent, useEffect, useState } from "react";

import { Item, Option } from "../common/types";
import { customSort, getBaseUrl, getDescription, getTitle, isInRanges, parseRanges } from "../common/utils";
import CardList from "../components/CardList";
import Layout from "../components/Layout";
import Sort from "../components/Sort";
import { itemCards } from "../data/item-cards";

const sortOrderOptions: Option[] = [
  { id: "id", name: "Número" },
  { id: "cost", name: "Coste" },
  { id: "name", name: "Nombre" },
];

const slotFilters: Option[] = [
  { id: "head", name: "Cabeza" },
  { id: "body", name: "Cuerpo" },
  { id: "1h", name: "1 Mano" },
  { id: "2h", name: "2 Manos" },
  { id: "legs", name: "Piernas" },
  { id: "small", name: "Objeto Pequeño" },
];

const activationsFilters: Option[] = [
  { id: "consumed", name: "Consumido" },
  { id: "spent", name: "Gastado" },
];

type FilterProps = {
  activationFilter: string;
  slotFilter: string;
  handleActivationFilterChange: (newValue: string) => void;
  handleSlotFilterChange: (newValue: string) => void;
};

const ItemFilters = ({
  activationFilter,
  slotFilter,
  handleActivationFilterChange,
  handleSlotFilterChange,
}: FilterProps) => {
  return (
    <div className="button-group filters">
      {slotFilters.map((slot, idx) => (
        <div
          key={idx}
          className={`filter-icon ${slotFilter === slot.id ? "filter-icon-selected" : ""}`}
          onClick={() => handleSlotFilterChange(slot.id)}
        >
          <img alt="" src={getBaseUrl() + `icons/items/${slot.id}.png`} />
        </div>
      ))}
      <span style={{ marginLeft: "16px" }} />
      {activationsFilters.map((activation, idx) => (
        <div
          key={idx}
          className={`filter-icon ${activationFilter === activation.id ? "filter-icon-selected" : ""}`}
          onClick={() => handleActivationFilterChange(activation.id)}
        >
          <img alt="" src={getBaseUrl() + `icons/items/${activation.id}.png`} />
        </div>
      ))}
    </div>
  );
};

type PageProps = {
  searchResults: Item[];
};

const Items = ({ searchResults }: PageProps) => {
  const [search, setSearch] = useState(null);
  const [slotFilter, setSlotFilter] = useState(null);
  const [activationFilter, setActivationFilter] = useState(null);
  const [sortOrder, setsortOrder] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(parseRanges(e.target.value));
  };
  const handleSlotFilterChange = (newValue: string) => {
    if (newValue === slotFilter) {
      setSlotFilter(null);
    } else {
      setSlotFilter(newValue);
    }
  };
  const handleActivationFilterChange = (newValue: string) => {
    if (newValue === activationFilter) {
      setActivationFilter(null);
    } else {
      setActivationFilter(newValue);
    }
  };
  const handleSortOrderChange = (newValue: string) => {
    setsortOrder(newValue);
  };
  const handleSortDirectionChange = (newValue: string) => {
    setSortDirection(newValue);
  };


  const cardList =
    searchResults
      ?.filter((item) => {
        if (search !== null && !isInRanges(item.id, search)) return false;
        if (slotFilter && item.slot !== slotFilter) return false;
        if (activationFilter === "consumed" && !item.consumed) return false;
        if (activationFilter === "spent" && !item.spent) return false;
        return true;
      })
      .sort(customSort(sortOrder || "id", sortDirection || "asc")) || [];

  return (
    <Layout description={getDescription("jotl", "Cartas de Objeto", searchResults)} title={getTitle("jotl", "Objetos")}>
      <div className="toolbar">
        <div className="toolbar-inner">
          <Sort
            sortOrderOptions={sortOrderOptions}
            handleSortOrderChange={handleSortOrderChange}
            handleSortDirectionChange={handleSortDirectionChange}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
          />
          <div className="flex" style={{ fontWeight: 600, justifyContent: "center" }}>
            {"ID Objeto:"}
            <input className="id-filter" onChange={handleSearchChange} placeholder="1-10,15" />
          </div>
          <ItemFilters
            activationFilter={activationFilter}
            slotFilter={slotFilter}
            handleActivationFilterChange={handleActivationFilterChange}
            handleSlotFilterChange={handleSlotFilterChange}
          />
        </div>
      </div>
      <CardList cardList={cardList} showId />
    </Layout>
  );
};

export default Items;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const searchResults = itemCards["jotl"]?.sort(customSort("id", "asc")) || [];
  return { props: { searchResults } };
};
