import ToastMessage from "@/components/custom/toast-message";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import type { FolderPreview } from "@/types/folder";
import toast from "react-hot-toast";

interface Props {
  folder: FolderPreview;
}

export function useRemoveFromFavorite() {
  const apiUtils = api.useUtils();
  const { mutate: removeFavorite, isPending } =
    api.favorite.remove.useMutation();

  function removeFromFavorite({ folder }: Props) {
    const removeFavToast = toast.loading(`Removing Folder From Favorites...`);

    removeFavorite(
      {
        workspaceId: folder.workspaceId,
        elementId: folder.element.id,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.custom(() => (
              <ToastMessage
                title={`Folder removed from Favorites.`}
                message={`The folder ${folder.element.name} has been removed from your favorites.`}
                mode={Mode.SUCCESS}
              />
            ));

            apiUtils.favorite.getFavorites.setData(
              { workspaceId: folder.workspaceId },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const { folders, ...others } = prev;

                const updateFolders = folders.filter((c) => c.id !== folder.id);

                return { ...others, folders: updateFolders };
              },
            );

            apiUtils.folder.getFolderItems.setData(
              {
                workspaceId: folder.workspaceId,
                parentFolderId: folder.parentFolderId ?? null,
              },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const updateFolders = prev.folders.map((c) =>
                  c.id === folder.id ? { ...c, favoriteId: null } : c,
                );

                return {
                  ...prev,
                  folders: updateFolders,
                };
              },
            );
          }
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              title={`Error removing folder from Favorites.`}
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
