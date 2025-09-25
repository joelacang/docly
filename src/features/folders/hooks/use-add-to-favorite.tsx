import ToastMessage from "@/components/custom/toast-message";
import { api } from "@/trpc/react";
import { Mode } from "@/types";
import type { FolderPreview } from "@/types/folder";
import toast from "react-hot-toast";

interface Props {
  folder: FolderPreview;
}

export function useAddFolderToFavorite() {
  const apiUtils = api.useUtils();
  const { mutate: addFavorite, isPending } = api.favorite.add.useMutation();

  function addToFavorite({ folder }: Props) {
    const addFavToast = toast.loading(`Adding Folder To Favorites...`);

    addFavorite(
      {
        workspaceId: folder.workspaceId,
        elementId: folder.element.id,
      },
      {
        onSuccess: (response) => {
          if (response?.folder) {
            toast.custom(() => (
              <ToastMessage
                title={`Added Folder to Favorites.`}
                message={`The folder ${response.folder.element.name} has been added to your favorites.`}
                mode={Mode.SUCCESS}
              />
            ));

            apiUtils.favorite.getFavorites.setData(
              { workspaceId: folder.workspaceId },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const { folders, ...others } = prev;

                const updatedFolders: FolderPreview[] = [
                  ...folders,
                  response.folder,
                ];

                return { ...others, folders: updatedFolders };
              },
            );

            //Update from cache
            apiUtils.folder.getFolderItems.setData(
              {
                workspaceId: folder.workspaceId,
                parentFolderId: folder.parentFolderId ?? null,
              },
              (prev) => {
                if (!prev) return { folders: [], collections: [] };

                const { folders: oldFolders } = prev;

                //Look for the folder
                const exists = oldFolders.find(
                  (c) => c.id === response.folder.id,
                );

                const updatedFolders = exists
                  ? prev.folders.map((c) =>
                      c.id === response.folder.id ? response.folder : c,
                    )
                  : [...oldFolders, response.folder];

                return {
                  ...prev,
                  folders: updatedFolders,
                };
              },
            );
          }
        },
        onError: (error) => {
          toast.custom(() => (
            <ToastMessage
              title={`Error adding Folder to Favorites.`}
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
