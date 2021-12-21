// strips db.json of unneeded data for the editor

let message = "Cleaning out db.json"
let db = require('./src/edit/db.json')

console.time(message)
console.log("Initial Length", JSON.stringify(db).length)

delete db.gameValueCategories;
delete db.particleCategories;
delete db.soundCategories;
delete db.cosmetics;
delete db.shops;

console.timeEnd(message)
console.log("Final Length", JSON.stringify(db).length)

require('fs').writeFileSync("./src/edit/db.json",JSON.stringify(db));