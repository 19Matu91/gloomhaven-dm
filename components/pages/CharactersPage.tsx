import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Character, CharacterAbility, CharacterAdditionalCardsSection, Option } from "../../common/types";
import {
  assignCardIds,
  customSort,
  getBaseUrl,
  getCharacter,
  getCharacterClasses,
  getDefaultCharacterClass,
  verifyQueryParam,
} from "../../common/utils";
import CardList from "../CardList";
import Sort from "../Sort";
import ToastMessage from "../ToastMessage";
import { characterAbilityCards } from "../../data/character-ability-cards";
import { characterAdditionalCards } from "../../data/character-additional-cards";
import { useCraftingStore } from "../../hooks/useCraftingStore";
import cardTranslations from "../../data/card-translations.json";
import { serializeBuild, deserializeBuild } from "../../common/shareUtils";

const sortOrderOptions: Option[] = [
  { id: "level", name: "Nivel" },
  { id: "initiative", name: "Iniciativa" },
  { id: "name", name: "Nombre" },
];

type ClassFilterProps = {
  characterClass: string;
  game: string;
};

const ClassFilter = ({ characterClass, game }: ClassFilterProps) => {
  const router = useRouter();
  const query = router.query;

  return (
    <div className="filters">
      {getCharacterClasses(game)
        .filter((c) => !c.hidden)
        .map((char) => (
          <Link
            key={char.class}
            href={{
              pathname: `/characters/${char.class}`,
              query: {
                ...(query.dir && { dir: query.dir }),
                ...(query.order && { order: query.order }),
              },
            }}
            className={`filter-icon ${characterClass === char.class ? "filter-icon-selected" : ""}`}
          >
            <img alt="" src={getBaseUrl() + `icons/characters/${game}/${char.class}.png`} />
          </Link>
        ))}
    </div>
  );
};

type CharacterDetailsProps = {
  character: Character;
};

const CharacterDetails = ({ character }: CharacterDetailsProps) => {
  return (
    <div className="character-details">
      <img alt="" src={getBaseUrl() + character.matImageBack} />
      <img alt="" src={getBaseUrl() + character.matImage} />
      <img alt="" src={getBaseUrl() + character.sheetImage} />
    </div>
  );
};

type AdditionalCardsProps = {
  sections: CharacterAdditionalCardsSection[];
};

const AdditionalCards = ({ sections }: AdditionalCardsProps) => {
  return (
    <>
      {sections.map((section) => (
        <div key={section.label} className="additional-cards-section">
          <CardList cardList={section.cards} horizontal={section.horizontal} />
        </div>
      ))}
    </>
  );
};

type PageProps = {
  searchResults: SearchResult;
  game: string;
  character: Character;
};

const CharactersPage = ({ character, game, searchResults }: PageProps) => {
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [sortOrder, setsortOrder] = useState("level");
  const [sortDirection, setSortDirection] = useState("asc");

  const {
    isCraftingMode,
    toggleCraftingMode,
    activeDeck,
    activeDeckClass,
    clearDeck,
    setDeck,
    toggleCard,
    viewActiveHand,
    toggleViewActiveHand,
    loadState,
    toastMessage,
    setToastMessage,
  } = useCraftingStore();

  const { abilityCards, additionalCards } = searchResults;
  const maxHandSize = abilityCards?.filter((c) => c.level === 1).length || 9;
  const showAdditionalCards = additionalCards && !isCraftingMode && !showCharacterDetails;

  const handleSortOrderChange = (newValue: string) => {
    setsortOrder(newValue);
  };
  const handleSortDirectionChange = (newValue: string) => {
    setSortDirection(newValue);
  };

  let cardList = abilityCards?.sort(customSort(sortOrder || "id", sortDirection || "asc")) || [];

  if (isCraftingMode && viewActiveHand) {
    cardList = cardList.filter((card) => activeDeck.includes(card.image));
  }

  useEffect(() => {
    if (character) document.documentElement.style.setProperty("--primary", character.colour);
  }, [character]);

  useEffect(() => {
    if (isCraftingMode && activeDeckClass && character?.class && activeDeckClass !== character.class) {
      clearDeck();
    }
  }, [character?.class, activeDeckClass, isCraftingMode, clearDeck]);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.build) {
      const decodedBuild = deserializeBuild(router.query.build as string);

      if (decodedBuild && character?.class) {
        if (decodedBuild.characterClass !== character.class) {
          setToastMessage(`El mazo es para otra clase (${decodedBuild.characterClass})`);
        } else {
          const idSet = new Set(decodedBuild.cardIds);
          const images = abilityCards?.filter((c) => idSet.has(c.id)).map((c) => c.image) || [];

          if (images.length > 0) {
            loadState(character.class, images);
          }
        }

        const url = new URL(window.location.href);
        url.searchParams.delete("build");
        router.replace(url.pathname + url.search, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.build, character?.class, abilityCards, loadState, setToastMessage, router]);

  const handleShare = () => {
    const cardIds = abilityCards?.filter((c) => activeDeck.includes(c.image)).map((c) => c.id) || [];

    const code = serializeBuild(character?.class, cardIds);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("build", code);
    navigator.clipboard.writeText(newUrl.toString());
    setToastMessage("¡Enlace copiado al portapapeles!");
  };

  return (
    <>
      <ToastMessage message={toastMessage} colour={character?.colour} />
      <div className="toolbar">
        <div className="toolbar-inner">
          <div>
            <div className="flex">
              <Sort
                sortOrderOptions={sortOrderOptions}
                handleSortOrderChange={handleSortOrderChange}
                handleSortDirectionChange={handleSortDirectionChange}
                sortOrder={sortOrder}
                sortDirection={sortDirection}
              />
            </div>
          </div>
          <div>
            <div className="button-group">
              <button
                className={!showCharacterDetails && !isCraftingMode ? "btn-selected" : ""}
                onClick={() => {
                  setShowCharacterDetails(false);
                  if (isCraftingMode) toggleCraftingMode();
                }}
              >
                Cartas de Habilidad
              </button>
              <button
                className={!showCharacterDetails && isCraftingMode ? "btn-selected" : ""}
                onClick={() => {
                  if (showCharacterDetails) setShowCharacterDetails(false);
                  if (!isCraftingMode) toggleCraftingMode();
                }}
              >
                Modo Mazo
              </button>
              <button
                className={showCharacterDetails ? "btn-selected" : ""}
                onClick={() => setShowCharacterDetails(true)}
              >
                Detalles del personaje
              </button>
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} characterClass={character?.class} />
      {character.link && (
        <a href={character.link} className="character-link" target="_blank">
          {character.linkLabel || character.link}
        </a>
      )}
      {showCharacterDetails ? (
        <CharacterDetails character={character} />
      ) : (
        <>
          <CardList
            cardList={cardList}
            isCraftingMode={isCraftingMode}
            activeDeck={activeDeck}
            onCardToggle={(image) => toggleCard(image, character?.class, maxHandSize)}
            translations={cardTranslations}
          />
          {isCraftingMode && <div style={{ padding: "36px" }} />}
        </>
      )}
      {showAdditionalCards && <AdditionalCards sections={additionalCards} />}

      {isCraftingMode && !showCharacterDetails && (
        <div className="build-toolbar" style={{ borderTopColor: character?.colour || "#555" }}>
          <span className="build-toolbar-label">
            Cartas: {activeDeck.length} / {maxHandSize}
          </span>
          <div className="build-toolbar-buttons">
            <button onClick={toggleViewActiveHand}>{viewActiveHand ? "Ver Todas" : "Ver Mano Activa"}</button>
            <button onClick={handleShare}>Compartir</button>
            <button
              onClick={() => {
                clearDeck();
                setToastMessage("¡Mano limpiada!");
                if (viewActiveHand) {
                  toggleViewActiveHand();
                }
              }}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export type CharacterPageProps = {
  searchResults: SearchResult;
};

export type SearchResult = {
  abilityCards: CharacterAbility[];
  additionalCards: CharacterAdditionalCardsSection[] | null;
};

export const characterSearchResults = (query: { [key: string]: string | string[] }): SearchResult => {
  const game = verifyQueryParam(query.game, "gh");
  const className = verifyQueryParam(query.character, getDefaultCharacterClass(game));

  const character = getCharacter(game, className?.toUpperCase());
  if (character == null) {
    return {
      abilityCards: [],
      additionalCards: null,
    };
  }

  const sorted =
    characterAbilityCards[game]?.[character?.class.toUpperCase()]
      ?.filter((card) => card.level !== 0)
      .sort(customSort("level", "asc")) || [];

  const additionalCards = characterAdditionalCards[game]?.[character?.class.toUpperCase()];

  return {
    abilityCards: assignCardIds(sorted),
    additionalCards: additionalCards || null,
  };
};

export default CharactersPage;
