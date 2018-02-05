const data = "//DEPOT3/bla/module32/MAIN/bla/file\n" +
   "//DEPOT1/bla/bla/module11/MAIN/file\n" +
   "//DEPOT1/bla/bla/bla/module13/MAIN/bla/bla/file\n" +
   "//DEPOT2/bla/module21/MAIN/bla/bla/file\n" +
   "//DEPOT3/bla/bla/module31/MAIN/bla/file\n" +
   "//DEPOT1/bla/module12/MAIN/bla/file\n";


let array = data.split("\n");

const MAIN = "/MAIN/";
const MAIN_LENGTH = MAIN.length;

array.sort(function (a, b) {
   function createObject(v) {
      if (!v) return {depot: "", module: "" };
      let depot = "";
      let module = "";
      let m = v.match(/\/([^\/]+)\//);
      if (m && m.length > 0) {
         depot = m[1];
      }
      m = v.match(/\/([^\/]+)\/MAIN\//);
      if (m && m.length > 0) {
         module = m[1];
      }
      return {depot: depot, module: module };
   }
   let v1 = createObject(a);
   let v2 = createObject(b);
   let v = v1.depot.localeCompare(v2.depot);
   if (v !== 0) return v;
   return v1.module.localeCompare(v2.module);
});

console.log(array.join("\n"));