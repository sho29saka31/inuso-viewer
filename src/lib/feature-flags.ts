import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

export interface ViewerFeatures {
  service: boolean;
  event: boolean;
  booth: boolean;
  busy: boolean;
  eat: boolean;
  notice: boolean;
  digital: boolean;
  map: boolean;
}

const DEFAULTS: ViewerFeatures = {
  service: true,
  event: true, booth: true, busy: true, eat: true,
  notice: true, digital: true, map: true,
};

export const getViewerFeatures = unstable_cache(
  async (): Promise<ViewerFeatures> => {
    try {
      const doc = await getDb().collection("config").doc("viewer_features").get();
      if (!doc.exists) return DEFAULTS;
      return { ...DEFAULTS, ...(doc.data() as Partial<ViewerFeatures>) };
    } catch {
      return DEFAULTS;
    }
  },
  ["viewer-features"],
  { tags: ["viewer-features"], revalidate: 60 }
);
