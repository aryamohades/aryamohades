function fib1(n) {
  if (n === 0 || n === 1) {
    return n;
  }
  return fib1(n - 1) + fib1(n - 2);
}
