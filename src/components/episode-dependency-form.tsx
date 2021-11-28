import { useFormikContext } from "formik";
import { useEffect } from "react";
import useAppContext, { EpisodeGeneratorInputs } from "../app-context";

const EpisodeFormDependency = () => {
  const {
    values: { days, durationInMinutes, episodesPerDay, order }
  } = useFormikContext<EpisodeGeneratorInputs>();
  const { setEpisodeInfo } = useAppContext();

  useEffect(() => {
    setEpisodeInfo({ days, durationInMinutes, episodesPerDay, order });
  }, [days, durationInMinutes, episodesPerDay, order, setEpisodeInfo]);

  return <></>;
};

export default EpisodeFormDependency;
