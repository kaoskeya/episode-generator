import { Container, Row, Col } from "react-bootstrap";

import {
  AppContext,
  AssetType,
  EpisodeGeneratorInputs,
  PinType
} from "./app-context";
import AssetForm from "./components/asset-form";
import AssetList from "./components/asset-list";
import AssetPinning from "./components/asset-pinning";

import EpisodeForm from "./components/episode-form";
import Episodes from "./components/episodes";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function App() {
  const [assets, setAssets] = useState<Array<AssetType>>([]);
  const [pins, setPins] = useState<Array<PinType>>([]);
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
        pins,
        setPins,
        episodeInfo,
        setEpisodeInfo
      }}
    >
      <Container fluid>
        <Row>
          <Col xs={4}>
            <b>Asset Generator</b>
            <AssetForm />
            <hr />
            <b>Generated Assets</b>
            <AssetList />
          </Col>
          <Col xs={4}>
            <b>Asset Pinning</b>
            <AssetPinning />
          </Col>
          <Col xs={4}>
            <b>Episode Calculation and Display</b>
            <EpisodeForm />
            <Episodes />
          </Col>
        </Row>
      </Container>
    </AppContext.Provider>
  );
}
