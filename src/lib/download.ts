import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import type { SectionResponse } from "src/client";
import type { SavedSection } from "src/types/schedule";
import { getColorFromIndex } from "./colors";

export default async function download(
  sections: SavedSection[],
  sectionById: Map<number, SectionResponse>,
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Unknown";

  const date = new Date();
  workbook.created = date;
  workbook.modified = date;
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 0,
      visibility: "visible",
    },
  ];

  // TODO: change for next semester
  const sheet = workbook.addWorksheet("Winter2026 Schedule");

  sheet.columns = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ].map((d) => {
    return {
      header: d,
      key: d,
      style: {
        font: {
          bold: true,
        },
        alignment: {
          horizontal: "center",
          vertical: "middle",
        },
      },
    };
  });

  const initalHour = 8;
  const finalHour = 18;
  for (let i = initalHour, k = 2; i <= finalHour; i += 0.5, k++) {
    const h = Math.floor(i);
    const m = (i % 1) * 60;

    const time = `${h}:${m === 0 ? "00" : "30"}`;

    const cell = sheet.getCell(`A${k}`);
    cell.value = time;
  }

  const cols = ["A", "B", "C", "D", "E", "F"];

  // add all classes
  for (const section of sections) {
    const { sectionId, colorIndex } = section;

    const fullSection = sectionById.get(sectionId);

    if (!fullSection) {
      continue;
    }

    const { textColor, bgColor } = getColorFromIndex(colorIndex);

    for (const time of fullSection.viewData) {
      const [d, [start, end]] = Object.entries(time)[0];
      const day = cols[Number(d)];

      for (let i = start + 1, k = 0; i < end + 1; i++, k++) {
        const cell = sheet.getCell(`${day}${i}`);
        cell.style = {
          font: {
            color: {
              argb: `FF${textColor?.replace("#", "").replace(/[0F]{3}/g, "$&$&")}`,
            },
          },
          fill: {
            fgColor: { argb: `FF${bgColor?.replace("#", "")}` },
            type: "pattern",
            pattern: "solid",
          },
        };

        switch (k) {
          case 0:
            cell.value = `${fullSection.section} ${fullSection.code}`;
            break;
          case 1:
            cell.value = fullSection.title ?? "";
            break;
          case 2:
            cell.value = fullSection.leclabs[0]?.prof ?? "";
            break;
        }
      }
    }
  }

  // auto fit columns
  cols.forEach((col) => {
    const c = sheet.getColumn(col);
    c.eachCell({ includeEmpty: false }, (cell) => {
      if (!cell.value) return;

      const cellWidth = cell.value.toString().length;

      if ((c.width ?? 0) < cellWidth) {
        c.width = cellWidth;
      }
    });
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const filetype =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const blob = new Blob([buffer], { type: filetype });
    FileSaver.saveAs(blob, "Winter2026 Schedule.xlsx");
    alert("File downloaded!");
  } catch (err) {
    console.log(err);
    alert("Failed to download. Try again.");
  }
}
