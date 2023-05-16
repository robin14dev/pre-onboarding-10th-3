import { useState, useEffect } from "react";
export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  // console.log(
  //   "useDebounce",
  //   `debouncedValue : ${debouncedValue}, value : ${value}`
  // );

  useEffect(() => {
    // console.log("useDebounce useEffect");

    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}
