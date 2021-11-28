import { v4 as uuidv4 } from "uuid";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from "unique-names-generator";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import useAppContext from "../app-context";
import { AssetFormType } from "./asset-form";

const AssetFormDependency = () => {
  const {
    values: { assetCount, min, max }
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
            seed: index + 1
          }),
          runtime:
            min * 1000 + Math.ceil(Math.random() * (max - min) * 100) * 10
        }))
    );
  }, [assetCount, min, max, setAssets]);

  return <></>;
};

export default AssetFormDependency;
