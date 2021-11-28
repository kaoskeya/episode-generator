import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { Form as RBForm } from "react-bootstrap-formik";
import useAppContext from "../app-context";
import EpisodeFormDependency from "./episode-dependency-form";

const EpisodeForm = () => {
  const { episodeInfo } = useAppContext();
  return (
    <Formik
      initialValues={episodeInfo}
      onSubmit={(values) => {
        // alert(JSON.stringify(values, null, 2))
      }}
    >
      <Form>
        <EpisodeFormDependency />
        <RBForm.Input label="Number of Days" name="days" type="number" />
        <RBForm.Input
          label="Episodes per Day"
          name="episodesPerDay"
          type="number"
        />
        <RBForm.Input
          label="Episode Target Duration (in mins)"
          name="durationInMinutes"
          type="number"
        />
        <RBForm.Select name="order" label="Order">
          <option value="SEQUENCE">SEQUENCE</option>
          <option value="SHUFFLE">SHUFFLE</option>
        </RBForm.Select>
      </Form>
    </Formik>
  );
};

export default EpisodeForm;
