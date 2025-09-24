import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CollectionCategory } from "@/types/element";
import { Colors } from "@/utils/colors";
import { COLLECTION_DISPLAYS } from "@/utils/elements";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import WorkspaceItemCard from "./workspace-item-card";
import { useCollectionFormDialog } from "@/features/collections/hooks/use-collection-form-dialog";

interface Props {
  category: CollectionCategory;
  parentFolderId?: string | null;
}

const CollectionCategorySection = ({ category, parentFolderId }: Props) => {
  const [open, setOpen] = useState(true);
  const Icon = category.icon;
  const color = Colors[category.color];
  const collections = Object.values(COLLECTION_DISPLAYS).filter(
    (collection) => collection.category?.name === category.name,
  );

  const { onOpen: openAddCollection } = useCollectionFormDialog();
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          className="flex h-12 flex-row items-center justify-start gap-3"
          variant="ghost"
        >
          <div
            className="rounded-full p-2 text-red-100"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${color.primary}, ${color.dark})`,
            }}
          >
            <Icon className="size-4" />
          </div>

          <p className="text-lg font-semibold">{category.name}</p>
          {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="space-y-5">
          <p className="text-muted-foreground">{category.description}</p>
          <div className="flex flex-wrap gap-4">
            {collections.map((collection) => (
              <WorkspaceItemCard
                key={collection.name}
                item={collection}
                onClick={() => {
                  openAddCollection({
                    parentFolderId,
                    collectionType: collection.type,
                  });
                }}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollectionCategorySection;
