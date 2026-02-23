import { expect } from "bun:test";
import { getAllSectionsAllGet, type SectionResponse } from "src/client";
import { given, then, when } from "./test-util";
import { getSectionFromSortedListWithId } from "./util";

let allSections: SectionResponse[] = [];

given.each([1, 41, 235, 900])("an existing section %p", (sectionId) => {
  when("getSectionFromSortedListWithId is called", () => {
    then("the returned value should be a valid section", async () => {
      if (allSections.length === 0) {
        const res = await getAllSectionsAllGet();

        if (!res.data) {
          throw new Error("no data");
        }

        allSections = res.data;
      }

      expect(allSections.length).toBeGreaterThan(0);
      const section = getSectionFromSortedListWithId(sectionId, allSections);
      expect(section).toBeTruthy();
      expect(section?.id).toBe(sectionId);
    });
  });
});
