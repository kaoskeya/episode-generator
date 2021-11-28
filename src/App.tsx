import { Container, Row, Col } from "react-bootstrap";

import { AppContext, AssetType, EpisodeGeneratorInputs } from "./app-context";
import AssetForm from "./components/asset-form";
import AssetList from "./components/asset-list";

import EpisodeForm from "./components/episode-form";
import Episodes from "./components/episodes";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function App() {
  const [assets, setAssets] = useState<Array<AssetType>>([]);
  const [episodeInfo, setEpisodeInfo] = useState<EpisodeGeneratorInputs>({
    days: 3,
    episodesPerDay: 2,
    durationInMinutes: 10,
    order: "SEQUENCE"
  });
  return (
    <AppContext.Provider
      value={{
        assets,
        setAssets,
        episodeInfo,
        setEpisodeInfo
      }}
    >
      <Container fluid>
        <Row>
          <Col xs={4}>
            <b>Asset Generator</b>
            <AssetForm />
            <AssetList />
          </Col>
          <Col xs={8}>
            <b>Episode Calculation and Display</b>
            <EpisodeForm />
            <Episodes />
          </Col>
        </Row>
      </Container>
    </AppContext.Provider>
  );
}
