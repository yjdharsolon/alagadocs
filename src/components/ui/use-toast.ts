
// Re-export from the correct location
import { toast } from "sonner"; 
import { useToast as useInternalToast } from "@/hooks/use-toast";

// Re-export the hook and toast function
export const useToast = useInternalToast;
export { toast };
