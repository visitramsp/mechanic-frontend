import { useEffect, useState } from "react";

const useDebounce = (searchQuery) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchQuery);
    }, 500);

    return () => clearTimeout(t);
  }, [searchQuery]);
  return search;
};

export default useDebounce;
