import { COLLECTION_CATEGORIES } from "@/utils/elements";
import CollectionCategorySection from "./collection-category-section";

interface Props {
  parentFolderId?: string | null;
}
const CollectionCategories = ({ parentFolderId }: Props) => {
  return (
    <div className="space-y-5 pt-6">
      {Object.entries(COLLECTION_CATEGORIES).map(([name, category]) => (
        <CollectionCategorySection
          key={name}
          category={category}
          parentFolderId={parentFolderId}
        />
      ))}
    </div>
  );
};

export default CollectionCategories;
