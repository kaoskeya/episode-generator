import { Accordion } from "react-bootstrap";
import { Duration } from "luxon";

import useAppContext from "../app-context";
import computeEpisodes from "./compute-episodes";

const Episodes = () => {
  const { assets, episodeInfo } = useAppContext();

  const episodes = computeEpisodes({ assets, episodeInfo });

  return (
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
  );
};

export default Episodes;
