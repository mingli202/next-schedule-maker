import type { Id } from "convex/_generated/dataModel";
import { create } from "zustand";

export type DataSource =
  | {
      type: "latest";
    }
  | {
      type: "upload";
      id: Id<"uploads">;
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
