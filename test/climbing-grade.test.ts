import ClimbingGrade from "../src/climbing-grade";

test("when given a system, ClimbingGrade.format should return the grade in specified system", () => {
  const grade = new ClimbingGrade("5a", "french");
  expect(grade.format("yds")).toBe("5.7");
});

test("if a grade matches multiple grades in another system, a range is returned", () => {
  const grade = new ClimbingGrade("7a", "french", { rangeDelimiter: "/" });
  expect(grade.format("yds")).toBe("5.11c/5.11d");
});
