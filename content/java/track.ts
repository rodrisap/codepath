import type { TrackOutline } from "../../src/content/types";

/**
 * The Java track: outline only for now. Each module notes how it compares to
 * Python, since you'll know Python by the time you start.
 * docs/ADDING_JAVA.md explains how to switch it on.
 */
export const javaTrack: TrackOutline = {
  id: "java",
  title: "Java",
  tagline: "Your second language: types, classes and the tools used in big companies.",
  status: "coming-soon",
  modules: [
    {
      id: "syntax-types",
      title: "1. Syntax & types",
      summary: "The main method, statements, semicolons, primitive types and String.",
      comparedToPython:
        "Python figures out types by itself; Java makes you declare them: `int nights = 3;`. Blocks use { } instead of indentation, and every statement ends with `;`. Code always lives inside a class.",
      lessons: [],
    },
    {
      id: "conditionals-loops",
      title: "2. Conditionals & loops",
      summary: "if/else, switch, for, while and the enhanced for loop.",
      comparedToPython:
        "Same ideas, different punctuation: `if (x > 3) { ... }` needs brackets around the condition. The classic `for (int i = 0; i < 10; i++)` replaces `for i in range(10)`. `&&`, `||`, `!` replace `and`, `or`, `not`.",
      lessons: [],
    },
    {
      id: "methods",
      title: "3. Methods",
      summary: "Defining methods with parameter and return types, overloading.",
      comparedToPython:
        "A Java method is a Python function with declared types: `static double total(int nights, double rate)`. No default arguments; instead you write several versions with different parameters (overloading).",
      lessons: [],
    },
    {
      id: "arrays-arraylist",
      title: "4. Arrays & ArrayList",
      summary: "Fixed-size arrays and the growable ArrayList.",
      comparedToPython:
        "A Python list is closest to Java's `ArrayList<Integer>`. Java also has arrays (`int[]`) with a fixed length. No slicing or negative indexes: you use methods like `get(i)` and `size()`.",
      lessons: [],
    },
    {
      id: "strings",
      title: "5. Strings",
      summary: "String methods, StringBuilder and formatting.",
      comparedToPython:
        "Many methods look familiar (`toUpperCase()`, `trim()`, `split()`), but you compare text with `a.equals(b)`, not `==`. `String.format(\"%.2f\", x)` plays the role of f-strings.",
      lessons: [],
    },
    {
      id: "oop",
      title: "6. Classes & OOP",
      summary: "Encapsulation, constructors, inheritance, interfaces and polymorphism.",
      comparedToPython:
        "Classes are central in Java. `__init__` becomes a constructor, `self` becomes `this` (and is usually implicit). Fields are marked `private` with getters/setters. Interfaces formalise duck typing.",
      lessons: [],
    },
    {
      id: "exceptions",
      title: "7. Exceptions",
      summary: "try/catch/finally, checked vs unchecked exceptions, throwing your own.",
      comparedToPython:
        "`try/except` becomes `try/catch`. Java adds *checked* exceptions: some methods force you to handle or declare errors (`throws IOException`), something Python never does.",
      lessons: [],
    },
    {
      id: "collections",
      title: "8. Collections",
      summary: "HashMap, HashSet, List and iterating over them.",
      comparedToPython:
        "A Python dict is a `HashMap<String, Integer>`, a set is a `HashSet<String>`. The generic types in < > say what they contain.",
      lessons: [],
    },
    {
      id: "file-io",
      title: "9. File I/O",
      summary: "Reading and writing files with java.nio, CSV parsing.",
      comparedToPython:
        "Python's `with open(...)` becomes `Files.readAllLines(Path.of(...))` or try-with-resources. More ceremony, same ideas.",
      lessons: [],
    },
    {
      id: "build-tools",
      title: "10. Build tools",
      summary: "Packages, compiling with javac, and a first look at Maven/Gradle.",
      comparedToPython:
        "Python runs source directly; Java compiles to bytecode first (`javac`, then `java`). Maven/Gradle play the role of pip + requirements.txt.",
      lessons: [],
    },
    {
      id: "capstone",
      title: "11. Capstone",
      summary: "Rebuild the motel booking manager in Java.",
      comparedToPython: "Same project as the Python capstone, so you can compare both languages side by side.",
      lessons: [],
    },
  ],
};
