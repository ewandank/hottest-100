import LoaderCircle from "lucide-solid/icons/loader-circle";

export const LoadingSpinner = () => (
  <div class="flex size-full items-center justify-center">
    <LoaderCircle class="size-64 animate-spin text-muted-foreground/60" stroke-width="1.5" />
  </div>
);
