import { createFileRoute } from "@tanstack/solid-router";
import CircleAlertIcon from "lucide-solid/icons/circle-alert";

import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";

export const Route = createFileRoute("/unsupported")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div class="flex h-full w-full items-center justify-center">
      <Card class="items-center text-center">
        <CardHeader class="flex flex-row items-center justify-center">
          <CircleAlertIcon class="size-10 pr-2" />
          <CardTitle class="">Unsupported Browser</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Due to the technical limitations, only desktop Chromium and Firefox based browsers are
            supported.
          </p>
          <p>Please re-open the page in a supported browser.</p>
        </CardContent>
      </Card>
    </div>
  );
}
