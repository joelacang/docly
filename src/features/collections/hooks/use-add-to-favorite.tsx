import ToastMessage from "@/components/custom/toast-message";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import type { CollectionPreview } from "@/types/collection";
import toast from "react-hot-toast";

interface Props {
  collection: CollectionPreview;
}

export function useAddCollectionToFavorite() {
  const apiUtils = api.useUtils();
  const { mutate: addFavorite, isPending } = api.favorite.add.useMutation();

  function addToFavorite({ collection }: Props) {
    const addFavToast = toast.loading(
      `Adding ${collection.type} To Favorites...`,
    );

    addFavorite(
      {
        workspaceId: collection.workspaceId,
        elementId: collection.element.id,
      },
      {
        onSuccess: (response) => {
          if (response?.collection) {
            toast.custom(() => (
              <ToastMessage
                title={`Added ${response.collection.type} to Favorites.`}
                message={`The ${response.collection.type} ${response.collection.element.name} has been added to your favorites.`}
                mode={Mode.SUCCESS}
              />
            ));

            apiUtils.favorite.getFavorites.setData(
              { workspaceId: collection.workspaceId },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const { collections, ...others } = prev;

                const updatedCollections: CollectionPreview[] = [
                  ...collections,
                  response.collection,
                ];

                return {
                  ...others,
                  collections: updatedCollections,
                };
              },
            );

            //Update from cache
            apiUtils.folder.getFolderItems.setData(
              {
                workspaceId: collection.workspaceId,
                parentFolderId: collection.parentFolderId ?? null,
              },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const { collections: oldCollections } = prev;

                const exists = oldCollections.some(
                  (c) => c.id === response.collection.id,
                );

                const updatedCollections = exists
                  ? oldCollections.map((c) =>
                      c.id === response.collection.id ? response.collection : c,
                    )
                  : oldCollections;

                return {
                  ...prev,
                  collections: updatedCollections,
                };
              },
            );
          }
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              title={`Error adding ${collection.type} to Favorites.`}
              message={error.message}
              mode={Mode.ERROR}
            />
          ));
        },
        onSettled: () => {
          toast.dismiss(addFavToast);
        },
      },
    );
  }

  return { addToFavorite, isPending };
}
