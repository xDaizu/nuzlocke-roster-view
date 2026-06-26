import { toast } from "@/hooks/use-toast";
import { storageService } from "@/services/storageService";
import { translations } from "@/data/translations";

/** Copy the saved team JSON to the clipboard, surfacing a toast on success/failure. */
export const exportTeamToClipboard = async (): Promise<void> => {
  try {
    const team = storageService.loadTeam();
    await navigator.clipboard.writeText(JSON.stringify(team, null, 2));
    toast({
      title: translations.messages.exported,
      description: translations.messages.exportedDesc,
      variant: 'default',
    });
  } catch {
    toast({
      title: translations.messages.error,
      description: translations.messages.exportError,
      variant: 'destructive',
    });
  }
};
