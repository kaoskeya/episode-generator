import useAppContext, { AssetType, ScheduleOrder } from "../app-context";
import { v4 as uuidv4 } from "uuid";
import { Duration } from "luxon";
import sha1 from "sha1";
// @ts-ignore
import shuffle from "knuth-shuffle-seeded";
import { Accordion } from "react-bootstrap";

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

const Episodes = () => {
  const { assets, episodeInfo } = useAppContext();
  const episodesToBeGenerated = episodeInfo.days * episodeInfo.episodesPerDay;
  const duration = episodeInfo.durationInMinutes * 60 * 1000;
  let episodes: Array<{ id: string; assets: Array<AssetType> }> = [];

  const eligibleAssets = assets.filter((a) => a.runtime < duration);

  if (eligibleAssets.length === 0) {
    // no eligible assets
    return [];
  }

  const nextAssetGenerator = getAsset({
    assets: eligibleAssets,
    order: episodeInfo.order
  });

  let nextAsset = nextAssetGenerator.next().value!;
  do {
    // exit when enough episoides are generated
    let episode: Array<AssetType> = [];
    do {
      // exit when target runtime is achieved
      episode = episode.concat([nextAsset]);
      nextAsset = nextAssetGenerator.next().value!;
    } while (
      episode.reduce((acc, iter) => acc + iter.runtime, 0) + nextAsset.runtime <
      duration
    );
    episodes = episodes.concat({
      id: uuidv4(),
      assets: episode
    });

    // if SEQUENCE, exit if last asset of episode, is the last elligibleAsset
    if (
      episodeInfo.order === "SEQUENCE" &&
      eligibleAssets[eligibleAssets.length - 1].id ===
        episode[episode.length - 1].id
    ) {
      break;
    }
  } while (episodes.length < episodesToBeGenerated);

  return (
    <Accordion>
      {episodes.map((episode, index) => (
        <Accordion.Item eventKey={`${index}`}>
          <Accordion.Header>
            Episode {index + 1}
            {" | "}
            {Duration.fromMillis(
              episode.assets.reduce((acc, iter) => acc + iter.runtime, 0)
            ).toISOTime()}
            {" | "}
            {episode.assets.length} assets
          </Accordion.Header>
          <Accordion.Body>
            <p>
              <b>Assets:</b>
              <ol>
                {episode.assets.map((a) => (
                  <li>{a.name}</li>
                ))}
              </ol>
            </p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default Episodes;
