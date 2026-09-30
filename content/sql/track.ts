import type { TrackOutline } from "../../src/content/types";

/** The SQL track. Lessons are built in Phase 3; until then it shows as "coming soon". */
export const sqlTrack: TrackOutline = {
  id: "sql",
  title: "SQL",
  tagline: "Ask questions of real data: the motel database, from SELECT to window functions.",
  status: "coming-soon",
  modules: [
    { id: "databases-tables", title: "1. Databases & tables", summary: "Tables, rows and columns, compared with spreadsheets.", lessons: [] },
    { id: "select", title: "2. SELECT & FROM", summary: "Choosing columns, calculations and aliases.", lessons: [] },
    { id: "where", title: "3. Filtering with WHERE", summary: "Comparisons, AND/OR, LIKE, IN, BETWEEN and NULL.", lessons: [] },
    { id: "order-limit", title: "4. ORDER BY, LIMIT, DISTINCT", summary: "Sorting, top-N lists and unique values.", lessons: [] },
    { id: "aggregates", title: "5. Aggregates", summary: "COUNT, SUM, AVG, MIN, MAX.", lessons: [] },
    { id: "group-by", title: "6. GROUP BY & HAVING", summary: "Totals per group, step by step.", lessons: [] },
    { id: "joins", title: "7. Joins", summary: "INNER and LEFT joins, and which rows survive.", lessons: [] },
    { id: "subqueries-ctes", title: "8. Subqueries & CTEs", summary: "Queries inside queries, and WITH.", lessons: [] },
    { id: "case-functions", title: "9. CASE, dates & strings", summary: "Conditional values, date and text functions.", lessons: [] },
    { id: "window-functions", title: "10. Window functions", summary: "ROW_NUMBER, RANK and running totals.", lessons: [] },
    { id: "changing-data", title: "11. Changing data", summary: "INSERT, UPDATE, DELETE and transactions.", lessons: [] },
    { id: "designing-tables", title: "12. Designing tables", summary: "Keys, normalisation and CREATE TABLE.", lessons: [] },
    { id: "sql-python", title: "13. SQL + Python", summary: "Querying a database from Python code.", lessons: [] },
    { id: "capstone", title: "14. Capstone", summary: "Build and analyse the motel database.", lessons: [] },
  ],
};
