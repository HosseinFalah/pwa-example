var db = new Dexie("sabzleanDB");

const dbVersion = 1;

// DB with single table "friends" with primary key "id" and
// indexes on properties "name" and "age"
db.version(dbVersion).stores({
    courses: "id"
});