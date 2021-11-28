import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type AssetType = {
  id: string;
  name: string;
  runtime: number;
};

export type ScheduleOrder = "SEQUENCE" | "SHUFFLE";

export type EpisodeGeneratorInputs = {
  days: number;
  episodesPerDay: number;
  durationInMinutes: number;
  order: ScheduleOrder;
};

type AssetContextType = {
  assets: Array<AssetType>;
  setAssets: Dispatch<SetStateAction<Array<AssetType>>>;
  episodeInfo: EpisodeGeneratorInputs;
  setEpisodeInfo: Dispatch<SetStateAction<EpisodeGeneratorInputs>>;
};

export const AppContext = createContext<AssetContextType>({
  assets: [],
  setAssets: () => {},
  episodeInfo: {
    days: 3,
    episodesPerDay: 2,
    durationInMinutes: 30,
    order: "SEQUENCE"
  },
  setEpisodeInfo: () => {}
});

const useAppContext = () => {
  return useContext(AppContext);
};

export default useAppContext;
