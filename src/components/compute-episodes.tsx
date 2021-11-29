import { AssetType, PinType, ScheduleOrder } from "../app-context";
import { v4 as uuidv4 } from "uuid";
import sha1 from "sha1";
// @ts-ignore
import shuffle from "knuth-shuffle-seeded";

function orderAssets({
  assets,
  order,
  seed
}: {
  assets: Array<AssetType>;
  order: ScheduleOrder;
  seed: string;
}) {
  if (order === "SEQUENCE") {
    return assets;
  } else {
    return shuffle(assets, seed);
  }
}

function* getAsset({
  assets,
  order
}: {
  assets: Array<AssetType>;
  order: ScheduleOrder;
}) {
  let iter = 0;
  const idHash = sha1(assets.map((a) => a.id).join(","));
  let orderedAssets = orderAssets({
    assets,
    order,
    seed: `${idHash}${++iter}`
  });

  do {
    const asset = orderedAssets[0];
    orderedAssets = orderedAssets.slice(1);
    yield asset;
    if (orderedAssets.length === 0) {
      orderedAssets = orderAssets({
        assets,
        order,
        seed: `${idHash}${++iter}`
      });
    }
  } while (true);
}

export type EpisodeType = {
  id: string;
  assets: Array<AssetType>;
};

const computeEpisodes = ({
  assets,
  episodesToBeGenerated,
  durationInMinutes,
  pins,
  order
}: {
  assets: Array<AssetType>;
  episodesToBeGenerated: Number;
  durationInMinutes: Number;
  pins: Array<PinType>;
  order: "SHUFFLE" | "SEQUENCE";
}): Array<EpisodeType> => {
  const duration: Number = durationInMinutes * 60 * 1000;
  let episodes: Array<EpisodeType> = [];

  const eligibleAssets = assets
    .filter((a) => !pins.find((pin) => pin.asset_id === a.id))
    .filter((a) => a.runtime < duration);

  const pinnedAssets = assets
    .filter((a) => pins.find((pin) => pin.asset_id === a.id))
    .filter((a) => a.runtime < duration)
    .map((a) => ({
      pin_position: pins.find((pin) => pin.asset_id === a.id)?.pin_position,
      asset: a
    }));

  if (eligibleAssets.length === 0) {
    // no eligible assets
    return [];
  }

  const nextAssetGenerator = getAsset({
    assets: eligibleAssets,
    order
  });

  let nextAsset = nextAssetGenerator.next().value!;

  const firstAsset = pinnedAssets.find((pin) => pin.pin_position === 1)?.asset;
  const lastAsset = pinnedAssets.find((pin) => pin.pin_position === -1)?.asset;

  do {
    // exit when enough episoides are generated
    let episode: Array<AssetType & { isPinned: boolean }> = firstAsset
      ? [{ ...firstAsset, isPinned: true }]
      : [];
    while (
      episode.reduce((acc, iter) => acc + iter.runtime, 0) +
        nextAsset.runtime +
        (lastAsset?.runtime || 0) <
      duration
    ) {
      // exit when target runtime is achieved

      // check if current position belong to a pinned asset or we need to get the next asset from the generator
      const currentPin = pinnedAssets.find(
        (pin) => pin.pin_position === episode.length + 1
      )?.asset;
      if (currentPin) {
        if (
          episode.reduce((acc, iter) => acc + iter.runtime, 0) +
            currentPin.runtime +
            (lastAsset?.runtime || 0) <
          duration
        ) {
          episode = episode.concat([{ ...currentPin, isPinned: true }]);
        }
      } else {
        episode = episode.concat([{ ...nextAsset, isPinned: false }]);
        nextAsset = nextAssetGenerator.next().value!;
      }
    }

    if (lastAsset) {
      episode = episode.concat([{ ...lastAsset, isPinned: true }]);
    }

    episodes = episodes.concat({
      id: uuidv4(),
      assets: episode
    });

    // if SEQUENCE, exit if last asset of episode, is the last elligibleAsset
    const episodeWithoutPins = episode.filter((e) => !e.isPinned);
    if (
      order === "SEQUENCE" &&
      eligibleAssets[eligibleAssets.length - 1].id ===
        episodeWithoutPins[episodeWithoutPins.length - 1].id
    ) {
      break;
    }
  } while (episodes.length < episodesToBeGenerated);

  return episodes;
};

export default computeEpisodes;
