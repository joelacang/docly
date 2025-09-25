import ToastMessage from "@/components/custom/toast-message";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import type { CollectionPreview } from "@/types/collection";
import toast from "react-hot-toast";

interface Props {
  collection: CollectionPreview;
}

export function useRemoveFromFavorite() {
  const apiUtils = api.useUtils();
  const { mutate: removeFavorite, isPending } =
    api.favorite.remove.useMutation();

  function removeFromFavorite({ collection }: Props) {
    const removeFavToast = toast.loading(
      `Removing ${collection.type} From Favorites...`,
    );

    removeFavorite(
      {
        workspaceId: collection.workspaceId,
        elementId: collection.element.id,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.custom(() => (
              <ToastMessage
                title={`${collection.type} removed from Favorites.`}
                message={`The ${collection.type} ${collection.element.name} has been removed from your favorites.`}
                mode={Mode.SUCCESS}
              />
            ));

            apiUtils.favorite.getFavorites.setData(
              { workspaceId: collection.workspaceId },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const { collections, ...others } = prev;

                const updatedCollections = collections.filter(
                  (c) => c.id !== collection.id,
                );

                return { ...others, collections: updatedCollections };
              },
            );

            apiUtils.folder.getFolderItems.setData(
              {
                workspaceId: collection.workspaceId,
                parentFolderId: collection.parentFolderId ?? null,
              },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const updatedCollections = prev.collections.map((c) =>
                  c.id === collection.id ? { ...c, favoriteId: null } : c,
                );

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
              title={`Error removing ${collection.type} from Favorites.`}
              message={error.message}
              mode={Mode.ERROR}
            />
          ));
        },
        onSettled: () => {
          toast.dismiss(removeFavToast);
        },
      },
    );
  }

  return { removeFromFavorite, isPending };
}
