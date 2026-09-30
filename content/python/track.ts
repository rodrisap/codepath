import type { TrackOutline } from "../../src/content/types";

/**
 * The Python track: module order, lesson order and titles.
 * Each lesson lives in content/python/<module id>/<lesson id>/.
 */
export const pythonTrack: TrackOutline = {
  id: "python",
  title: "Python",
  tagline: "From your first print() to a working motel booking manager.",
  status: "ready",
  modules: [
    {
      id: "getting-started",
      title: "1. Getting started",
      summary: "What programming is, print(), comments, and reading error messages.",
      lessons: [
        { id: "hello-print", title: "Your first program" },
        { id: "comments-and-errors", title: "Comments & reading errors" },
        { id: "project-receipt", title: "Project: a printed receipt", kind: "project" },
      ],
    },
    {
      id: "variables-types",
      title: "2. Variables & data types",
      summary: "Storing values, the four basic types, converting between them, f-strings.",
      lessons: [
        { id: "variables", title: "Variables & types" },
        { id: "conversion-fstrings", title: "Type conversion & f-strings" },
        { id: "project-booking-card", title: "Project: booking summary card", kind: "project" },
      ],
    },
    {
      id: "operators-math",
      title: "3. Operators & math",
      summary: "Arithmetic, operator order, rounding, and everyday business calculations.",
      lessons: [
        { id: "arithmetic", title: "Arithmetic & operator order" },
        { id: "business-math", title: "Rounding & business calculations" },
        { id: "project-invoice", title: "Project: invoice calculator", kind: "project" },
      ],
    },
    {
      id: "input-programs",
      title: "4. Input & basic programs",
      summary: "Asking the user for values and building small interactive tools.",
      lessons: [
        { id: "input-basics", title: "Asking for input" },
        { id: "project-price-quote", title: "Project: price quote tool", kind: "project" },
      ],
    },
    {
      id: "conditionals",
      title: "5. Conditionals",
      summary: "Making decisions with if/elif/else, comparisons and and/or/not.",
      lessons: [
        { id: "if-else", title: "if & else" },
        { id: "elif-logic", title: "elif, and, or, not" },
        { id: "project-rate-rules", title: "Project: seasonal rate rules", kind: "project" },
      ],
    },
    {
      id: "loops",
      title: "6. Loops",
      summary: "Repeating work with for, while and range, and tracing loops step by step.",
      lessons: [
        { id: "for-range", title: "for loops & range()" },
        { id: "while-loops", title: "while loops" },
        { id: "break-continue", title: "break & continue" },
        { id: "project-occupancy", title: "Project: weekly occupancy report", kind: "project" },
      ],
    },
    {
      id: "lists-tuples",
      title: "7. Lists & tuples",
      summary: "Collections of values: indexing, slicing, methods and looping.",
      lessons: [
        { id: "lists", title: "Lists: indexing, slicing, methods" },
        { id: "looping-lists", title: "Looping over lists & tuples" },
        { id: "project-expense-log", title: "Project: expense log", kind: "project" },
      ],
    },
    {
      id: "dicts-sets",
      title: "8. Dictionaries & sets",
      summary: "Modelling real records, such as a booking stored as a dict.",
      lessons: [
        { id: "dicts", title: "Dictionaries" },
        { id: "sets-nested", title: "Sets & nested data" },
        { id: "project-guest-registry", title: "Project: guest registry", kind: "project" },
      ],
    },
    {
      id: "functions",
      title: "9. Functions",
      summary: "Packaging logic: parameters, return values, scope, defaults, docstrings.",
      lessons: [
        { id: "functions-basics", title: "Defining & calling functions" },
        { id: "scope-defaults", title: "Scope, defaults & docstrings" },
        { id: "project-pricing-toolkit", title: "Project: pricing toolkit", kind: "project" },
      ],
    },
    {
      id: "strings",
      title: "10. Strings in depth",
      summary: "String methods, formatting, and cleaning messy data.",
      lessons: [
        { id: "string-methods", title: "String methods & formatting" },
        { id: "cleaning-data", title: "Cleaning messy data" },
        { id: "project-clean-guest-list", title: "Project: clean a guest list", kind: "project" },
      ],
    },
    {
      id: "errors",
      title: "11. Error handling",
      summary: "try/except, raising your own errors, and validating input.",
      lessons: [
        { id: "try-except", title: "try & except" },
        { id: "raise-validate", title: "Raising errors & validating" },
        { id: "project-safe-input", title: "Project: bulletproof booking form", kind: "project" },
      ],
    },
    {
      id: "files",
      title: "12. Files",
      summary: "Reading and writing text files and CSV files.",
      lessons: [
        { id: "text-files", title: "Reading & writing text files" },
        { id: "csv-files", title: "CSV files" },
        { id: "project-csv-report", title: "Project: CSV revenue report", kind: "project" },
      ],
    },
    {
      id: "modules-stdlib",
      title: "13. Modules & the standard library",
      summary: "math, random, datetime and json: tools that come with Python.",
      lessons: [
        { id: "math-random-datetime", title: "math, random & datetime" },
        { id: "json", title: "Working with JSON" },
        { id: "project-stay-calculator", title: "Project: stay calculator with dates", kind: "project" },
      ],
    },
    {
      id: "comprehensions",
      title: "14. Comprehensions & built-ins",
      summary: "sum, min, max, sorted, zip, enumerate and one-line list building.",
      lessons: [
        { id: "builtins", title: "Useful built-ins" },
        { id: "comprehensions", title: "List & dict comprehensions" },
        { id: "project-kpi-dashboard", title: "Project: KPI summary", kind: "project" },
      ],
    },
    {
      id: "oop",
      title: "15. Object-oriented programming",
      summary: "Classes, objects, methods, __init__ and simple inheritance.",
      lessons: [
        { id: "classes-objects", title: "Classes & objects" },
        { id: "inheritance", title: "Methods & inheritance" },
        { id: "project-room-classes", title: "Project: Room & Booking classes", kind: "project" },
      ],
    },
    {
      id: "pandas",
      title: "16. Working with data (pandas)",
      summary: "Load a CSV, filter, group and summarise with pandas.",
      lessons: [
        { id: "pandas-basics", title: "DataFrames: load & filter" },
        { id: "pandas-groupby", title: "Group & summarise" },
        { id: "project-pandas-report", title: "Project: monthly revenue with pandas", kind: "project" },
      ],
    },
    {
      id: "clean-code",
      title: "17. Clean code & testing",
      summary: "Naming, structure, asserts and a debugging strategy.",
      lessons: [
        { id: "clean-code", title: "Writing readable code" },
        { id: "testing-debugging", title: "Testing & debugging" },
      ],
    },
    {
      id: "capstone",
      title: "18. Capstone",
      summary: "A motel booking & revenue manager that uses everything.",
      lessons: [{ id: "motel-manager", title: "Capstone: motel booking manager", kind: "capstone" }],
    },
  ],
};
