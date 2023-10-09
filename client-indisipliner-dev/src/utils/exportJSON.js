import exportFromJSON from "export-from-json";

// const data = [{ foo: "foo" }, { bar: "bar" }];
// const fileName = "download";
// const exportType = "csv";

export function exportAsExcel(data) {
  let fileName = Date.now().toString();
  let exportType = "xls";
  exportFromJSON({ data, fileName, exportType });
}
