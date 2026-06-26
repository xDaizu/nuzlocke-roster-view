import { toast } from "@/hooks/use-toast";
import { storageService } from "@/services/storageService";

/** Copy the saved team JSON to the clipboard, surfacing a toast on success/failure. */
export const exportTeamToClipboard = async (): Promise<void> => {
  try {
    const team = storageService.loadTeam();
    await navigator.clipboard.writeText(JSON.stringify(team, null, 2));
    toast({
      title: 'Exported!',
      description: 'Team data copied to clipboard.',
      variant: 'default',
    });
  } catch (err) {
    toast({
      title: 'Error',
      description: 'Failed to copy team data to clipboard.',
      variant: 'destructive',
    });
  }
};
