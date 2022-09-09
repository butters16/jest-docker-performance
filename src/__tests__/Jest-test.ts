function sum(a: number, b: number) {
  return a + b;
}
it("TS", () => {
  expect(sum(1, 2)).toBe(3);
});
