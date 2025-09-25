"use client";

import { useParams } from "next/navigation";

const CollectionHomePage = () => {
  const { collectionType, collectionSlug } = useParams();
  return (
    <div>
      <p>
        This is the page for {collectionType} - {collectionSlug}
      </p>
    </div>
  );
};

export default CollectionHomePage;
