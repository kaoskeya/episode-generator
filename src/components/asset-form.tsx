import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { Form as RBForm } from "react-bootstrap-formik";

import AssetFormDependency from "./asset-dependency-form";

export type AssetFormType = {
  assetCount: number;
  min: number;
  max: number;
};

const AssetForm = () => {
  return (
    <Formik
      initialValues={{
        assetCount: 50,
        min: 5,
        max: 30
      }}
      onSubmit={(values) => {
        // alert(JSON.stringify(values, null, 2))
      }}
    >
      <Form>
        <AssetFormDependency />
        <RBForm.Input
          label="Number of Assets"
          name="assetCount"
          type="number"
        />
        <RBForm.Input
          label="Minimum Asset Length (in seconds)"
          name="min"
          type="number"
          min={1}
          max={10 * 60}
        />
        <RBForm.Input
          label="Maximum Asset Length (in seconds)"
          name="max"
          type="number"
          min={1}
          max={10 * 60}
        />
      </Form>
    </Formik>
  );
};

export default AssetForm;
