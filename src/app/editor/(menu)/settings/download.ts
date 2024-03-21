import { getLocalJsonData } from "@/lib";
import { Class, SharedCurrentClasses } from "@/types";
import ExcelJS from "exceljs";
import FileSaver from "file-saver";

const download = async (currentSchedule: SharedCurrentClasses[]) => {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");
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

  const sheet = workbook.addWorksheet("Fall 2024 Schedule");

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
  for (const schedule of currentSchedule) {
    const { id, textColor, bgColor } = schedule;
    const cl = allClasses[id];

    for (const time of cl.viewData) {
      const [d, [start, end]] = Object.entries(time)[0];
      const day = cols[Number(d)];

      for (let i = start + 1, k = 0; i < end + 1; i++, k++) {
        const cell = sheet.getCell(`${day}${i}`);
        cell.style = {
          font: {
            color: {
              argb:
                "FF" + textColor?.replace("#", "").replace(/[0F]{3}/g, "$&$&"),
            },
          },
          fill: {
            fgColor: { argb: "FF" + bgColor?.replace("#", "") },
            type: "pattern",
            pattern: "solid",
          },
        };

        switch (k) {
          case 0:
            cell.value = `${cl.section} ${cl.code}`;
            break;
          case 1:
            cell.value = cl.lecture.title;
            break;
          case 2:
            cell.value = cl.lecture.prof;
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

      if (c.width! < cellWidth) {
        c.width = cellWidth;
      }
    });
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    const filetype =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const blob = new Blob([buffer], { type: filetype });
    FileSaver.saveAs(blob, "Fall 2024 Schedule.xlsx");
    alert("File downloaed!");
  } catch (err) {
    console.log(err);
    alert("Failed to download. Try again.");
  }
};

export default download;
