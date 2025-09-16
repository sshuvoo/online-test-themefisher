import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex gap-2 justify-center items-center">
      <Loader2Icon className="animate-spin" />
      Loading...
    </div>
  );
}
