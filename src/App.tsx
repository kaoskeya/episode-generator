import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { Formik, Form, Field, useFormikContext } from "formik";
import { v4 as uuidv4 } from "uuid";
import { Duration } from "luxon";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from "unique-names-generator";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createContext,
  SetStateAction,
  useEffect,
  Dispatch,
  useState,
  useContext
} from "react";

type AssetType = {
  id: string;
  name: string;
  runtime: number;
};

type AssetContextType = {
  // assetCount: number;
  // setAssetCount: Dispatch<SetStateAction<number>>;
  assets: Array<AssetType>;
  setAssets: Dispatch<SetStateAction<Array<AssetType>>>;
};

const AppContext = createContext<AssetContextType>({
  // assetCount: 5,
  // setAssetCount: (val) => {}
  assets: [],
  setAssets: () => {}
});

const useAppContext = () => {
  return useContext(AppContext);
};

type AssetFormType = {
  assetCount: number;
};

const AssetFormDependency = () => {
  const {
    values: { assetCount }
  } = useFormikContext<AssetFormType>();
  const { setAssets } = useAppContext();

  useEffect(() => {
    setAssets(
      Array(assetCount)
        .fill(1)
        .map((_, index) => ({
          id: uuidv4(),
          name: uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            seed: index
          }),
          runtime: 1000 + Math.ceil(Math.random() * 4 * 100) * 10 // up to 1 to 5 mins
        }))
    );
  }, [assetCount, setAssets]);

  return <></>;
};

const AssetForm = () => {
  return (
    <Formik
      initialValues={{
        assetCount: 5
      }}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
    >
      <Form>
        <AssetFormDependency />
        <Field name="assetCount" type="number" />
      </Form>
    </Formik>
  );
};

const AssetList = () => {
  const { assets } = useAppContext();

  return (
    <ListGroup variant="flush">
      {assets.map((asset) => (
        <ListGroup.Item>
          {asset.name}
          <Badge pill bg="dark">
            {Duration.fromMillis(asset.runtime).toISOTime().toString().slice(6)}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default function App() {
  // const [assetCount, setAssetCount] = useState(5);
  const [assets, setAssets] = useState<Array<AssetType>>([]);
  return (
    <AppContext.Provider
      value={{
        // assetCount,
        // setAssetCount
        assets,
        setAssets
      }}
    >
      <Container fluid>
        <Row>
          <Col xs={4}>
            <AssetForm />

            <AssetList />
          </Col>
          <Col xs={8}>8 of 12</Col>
        </Row>
      </Container>
    </AppContext.Provider>
  );
}
