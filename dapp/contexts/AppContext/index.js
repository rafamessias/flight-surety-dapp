import React, { useState } from "react";

export default function AppContext() {
  const [currentPage, setCurrentPage] = useState({});

  return { currentPage, setCurrentPage };
}
