# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Production build
npm run lint      # ESLint + Next.js lint
npm run format    # Prettier
npm run data      # Regenerate TypeScript data files from JSON sources
```

No test runner configured.

## Architecture

Static Next.js site for browsing Gloomhaven board game card collections across 8 game variants.

**Data pipeline:** JSON files in `/data/*/` → Node.js generation scripts → TypeScript modules exported as `Record<string, Type[]>` indexed by game ID. Run `npm run data` after editing any JSON source. Never hand-edit the generated `.ts` files.

**Game registry:** `/data/games.ts` defines all supported games (gh, fh, jotl, cs, toa, mercenary, etc.). New games must be registered here.

**Routing:** `/pages/[game]/[cardType]/[entity].tsx` — dynamic routes driven by game + entity. All pages are statically generated.

**State:**
- Spoilers: React Context in `/hooks/useSpoilers.tsx`, persisted to localStorage. Tracks unlocked characters/buildings and prosperity level.
- Deck building (crafting mode): Zustand store in `/hooks/useCraftingStore.ts`. Decks serialized via `lz-string` for URL sharing.

**Images:** Hosted on the `images` branch of `cmlenius/gloomhaven-card-browser` GitHub repo — not in this repo. Adding new card content requires two PRs: one to the images branch, one to main.

## Key Types

Defined in `/common/types.ts`:
- `Character` — class ID, colour, name, game, mat/sheet image paths, base/hidden flags
- `CharacterAbility` — class, game, image path, initiative, level (0=back card, 1–9=ability levels)
- `Item`, `Event`, `Monster`, `Building`, `Pet` — similar shape with game + image + type-specific fields

## Adding Custom Content

See `HOW_TO_ADD_A_CUSTOM_CLASS.md` for the full two-PR process (images branch first, then data JSON + regeneration).
