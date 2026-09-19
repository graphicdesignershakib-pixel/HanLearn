// Service to manage Admin view mode (Admin Management Console vs. Preview as Student)

class AdminStateService {
  private previewAsStudent: boolean = false;
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("hanlearn_admin_preview_student");
        this.previewAsStudent = saved === "true";
      } catch {}
    }
  }

  public isPreviewAsStudent(): boolean {
    return this.previewAsStudent;
  }

  public setPreviewAsStudent(val: boolean) {
    this.previewAsStudent = val;
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("hanlearn_admin_preview_student", val ? "true" : "false");
      } catch {}
    }
    this.notify();
  }

  public togglePreview() {
    this.setPreviewAsStudent(!this.previewAsStudent);
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const adminStateService = new AdminStateService();
