import { expect } from "bun:test";
import type { SearchSectionParams } from "src/types/schedule";
import { fetchStore } from "../store/section";
import { given, then, when } from "../test-util";
import { filterDown } from "./filterDown";

given("search params with course filter", async () => {
  const store = await fetchStore();

  when("fitlerDown() is called", () => {
    then("every section should respect the filter", () => {
      const search: SearchSectionParams = { course: "science" };
      const sections = filterDown(store, search);

      for (const section of sections) {
        expect(section.course.toLowerCase()).toContain("science");
      }
    });
  });
});
