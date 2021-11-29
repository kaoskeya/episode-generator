import { Badge, ListGroup } from "react-bootstrap";
import useAppContext from "../app-context";
import { Duration } from "luxon";

const AssetList = () => {
  const { assets } = useAppContext();

  return (
    <ListGroup variant="flush">
      {assets.map((asset) => (
        <ListGroup.Item className="d-flex justify-content-between align-items-start">
          {asset.name}
          <Badge pill bg="dark">
            {Duration.fromMillis(asset.runtime).toISOTime().toString().slice(3)}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default AssetList;
