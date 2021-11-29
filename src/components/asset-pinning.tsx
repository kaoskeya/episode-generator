import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Form as RBForm } from "react-bootstrap-formik";
import useAppContext, { PinType } from "../app-context";

const AssetPinningDependency = () => {
  const {
    values: { pins }
  } = useFormikContext<{ pins: Array<PinType> }>();
  const { setPins } = useAppContext();

  useEffect(() => {
    setPins(
      pins.filter((pin) => !!pin.asset_id).filter((pin) => !!pin.pin_position)
    );
  }, [pins, setPins]);

  return <></>;
};

const AssetPinning = () => {
  const { assets } = useAppContext();
  const initialValues: { pins: Array<PinType> } = { pins: [] };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values }) => (
        <Form>
          <AssetPinningDependency />
          <FieldArray name="pins">
            {({ move, swap, push, insert, unshift, pop, form }) => (
              <div>
                <Button
                  onClick={() => {
                    insert(values.pins.length, {
                      asset_id: "",
                      pin_position: 0
                    });
                  }}
                >
                  Add
                </Button>
                {values.pins.map((pin, index) => (
                  <div key={pin.asset_id}>
                    Pin {index + 1}
                    <RBForm.Select name={`pins.${index}.asset_id`}>
                      {assets.map((asset) => (
                        <option value={asset.id}>{asset.name}</option>
                      ))}
                    </RBForm.Select>
                    <RBForm.Input
                      type="number"
                      name={`pins.${index}.pin_position`}
                    />
                    <hr />
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default AssetPinning;
