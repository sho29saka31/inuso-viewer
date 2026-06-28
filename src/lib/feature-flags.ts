import { getDb } from "@/lib/firebase-admin";

export interface ViewerFeatures {
  event: boolean;
  booth: boolean;
  busy: boolean;
  eat: boolean;
  notice: boolean;
  digital: boolean;
  map: boolean;
}

const DEFAULTS: ViewerFeatures = {
  event: true, booth: true, busy: true, eat: true,
  notice: true, digital: true, map: true,
};

export async function getViewerFeatures(): Promise<ViewerFeatures> {
  try {
    const doc = await getDb().collection("config").doc("viewer_features").get();
    if (!doc.exists) return DEFAULTS;
    return { ...DEFAULTS, ...(doc.data() as Partial<ViewerFeatures>) };
  } catch {
    return DEFAULTS;
  }
}
