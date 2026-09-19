import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type ResourceCategory = "vocabulary" | "grammar" | "reading" | "culture" | "other";

export interface CustomResource {
  id?: string;
  title: string;
  category: ResourceCategory;
  hskLevel: string;
  contentChinese: string;
  pinyin?: string;
  english?: string;
  bengali?: string;
  notes?: string;
  authorUid: string;
  authorEmail: string;
  createdAt?: any;
  updatedAt?: any;
}

const RESOURCES_COLLECTION = "resources";

export const resourceService = {
  // Subscribe to real-time resources list
  subscribeResources: (
    onUpdate: (resources: CustomResource[]) => void,
    categoryFilter?: ResourceCategory
  ) => {
    const colRef = collection(db, RESOURCES_COLLECTION);
    let q = query(colRef, orderBy("createdAt", "desc"));
    if (categoryFilter) {
      q = query(colRef, where("category", "==", categoryFilter), orderBy("createdAt", "desc"));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items: CustomResource[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...(d.data() as Omit<CustomResource, "id">) });
        });
        onUpdate(items);
      },
      (error) => {
        console.warn("Error subscribing to resources (fallback to empty or local):", error);
        onUpdate([]);
      }
    );
  },

  // Add new resource (Admin only)
  addResource: async (resource: Omit<CustomResource, "id" | "createdAt" | "updatedAt">) => {
    const colRef = collection(db, RESOURCES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...resource,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  // Update resource
  updateResource: async (id: string, updates: Partial<CustomResource>) => {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  // Delete resource
  deleteResource: async (id: string) => {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await deleteDoc(docRef);
  },
};
