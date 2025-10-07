import { COLLECTION_CATEGORIES } from "@/utils/elements";
import CollectionCategorySection from "./collection-category-section";

interface Props {
  parentFolderId?: string | null;
  teamId?: string | null;
}
const CollectionCategories = ({ parentFolderId, teamId }: Props) => {
  return (
    <div className="space-y-5 pt-6">
      {Object.entries(COLLECTION_CATEGORIES).map(([name, category]) => (
        <CollectionCategorySection
          key={name}
          category={category}
          parentFolderId={parentFolderId}
          teamId={teamId}
        />
      ))}
    </div>
  );
};

export default CollectionCategories;
