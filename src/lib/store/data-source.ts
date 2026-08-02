import type { UserUploadData } from "convex/types";
import { create } from "zustand";

export type DataSource =
  | {
      type: "latest";
    }
  | {
      type: "upload";
      userUploadData: UserUploadData;
    };

interface DataSourceStore {
  dataSource: DataSource;
  setSource: (source: DataSource) => void;
}

/**
 * The data source store
 * */
export const useDataSourceStore = create<DataSourceStore>((set) => ({
  dataSource: { type: "latest" },
  setSource: (dataSource) => set({ dataSource }),
}));
