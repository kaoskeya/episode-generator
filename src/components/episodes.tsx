import { Accordion } from "react-bootstrap";
import { Duration } from "luxon";

import useAppContext from "../app-context";
import computeEpisodes from "./compute-episodes";

const Episodes = () => {
  const { assets, pins, episodeInfo } = useAppContext();

  const episodes = computeEpisodes({
    assets,
    durationInMinutes: episodeInfo.durationInMinutes,
    order: episodeInfo.order,
    pins,
    episodesToBeGenerated: episodeInfo.days * episodeInfo.episodesPerDay
  });

  return (
    <>
      <pre>{JSON.stringify(pins, null, 2)}</pre>
      <Accordion>
        {episodes.map((episode, index) => (
          <Accordion.Item key={episode.id} eventKey={`${index}`}>
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
    </>
  );
};

export default Episodes;
