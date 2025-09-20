import { COLLECTION_CATEGORIES } from "@/utils/elements";
import CollectionCategorySection from "./collection-category-section";

const CollectionCategories = () => {
  return (
    <div className="space-y-5 pt-6">
      {Object.entries(COLLECTION_CATEGORIES).map(([name, category]) => (
        <CollectionCategorySection key={name} category={category} />
      ))}
    </div>
  );
};

export default CollectionCategories;
