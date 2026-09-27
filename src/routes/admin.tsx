import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { useSiteImages } from "@/hooks/use-site-images";
import {
  EXPERIENCE_SECTIONS,
  HOME_SLOTS,
  IMAGE_BUCKET,
  MAX_UPLOAD_FILES,
  type SiteImage,
} from "@/lib/site-images";
import { DhaRaPage } from "@/components/dhara-site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio Admin | DhaRa Studios & Films" },
      { name: "description", content: "Private studio area for managing DhaRa website photography." },
      { property: "og:title", content: "Studio Admin | DhaRa Studios & Films" },
      { property: "og:description", content: "Private studio area for managing DhaRa website photography." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Destination = { placement: "home" | "gallery" | "experience"; value: string };
type Notice = { kind: "success" | "error" | "info"; text: string } | null;

const MAX_ZIP_FILES = 100;
const HERO_MAX_EDGE = 1600;
const SITE_MAX_EDGE = 2200;
const HERO_UPLOAD_QUALITY = 0.72;
const SITE_UPLOAD_QUALITY = 0.82;
const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

function getImageSize(file: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be opened."));
    };
    image.src = url;
  });
}

async function optimizeImageForUpload(file: File, isHero: boolean): Promise<File> {
  const type = file.type.toLowerCase();
  if (type === "image/gif" || type === "image/avif") return file;

  const { width, height } = await getImageSize(file);
  const maxEdge = isHero ? HERO_MAX_EDGE : SITE_MAX_EDGE;
  const ratio = Math.min(1, maxEdge / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * ratio));
  const targetHeight = Math.max(1, Math.round(height * ratio));
  const bitmap = await createImageBitmap(file, {
    resizeWidth: targetWidth,
    resizeHeight: targetHeight,
    resizeQuality: "high",
  });
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }
  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", isHero ? HERO_UPLOAD_QUALITY : SITE_UPLOAD_QUALITY);
  });
  if (!blob || blob.size >= file.size) return file;
  const name = file.name.replace(/\.[^.]+$/, "") || "dhara-photo";
  return new File([blob], `${name}.webp`, { type: "image/webp", lastModified: Date.now() });
}

async function expandZips(input: File[]): Promise<File[]> {
  const out: File[] = [];
  for (const file of input) {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      if (file.type.startsWith("image/")) out.push(file);
      continue;
    }
    const { unzipSync } = await import("fflate");
    const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
    Object.keys(entries)
      .sort()
      .forEach((name) => {
        const base = name.split("/").pop() ?? "";
        if (!base || base.startsWith(".") || name.startsWith("__MACOSX")) return;
        const type = IMAGE_TYPES[base.split(".").pop()?.toLowerCase() ?? ""];
        if (!type) return;
        out.push(new File([entries[name] as BlobPart], base, { type }));
      });
  }
  return out;
}

function parseDestination(raw: string): Destination {
  const [placement, value] = raw.split(":");
  const validPlacement = placement === "gallery" || placement === "experience" ? placement : "home";
  return { placement: validPlacement, value: value ?? "" };
}

function sameGroup(images: SiteImage[], image: SiteImage): SiteImage[] {
  return images
    .filter(
      (row) =>
        row.placement === image.placement &&
        (image.placement === "home"
          ? row.slot === image.slot
          : image.placement === "experience"
            ? row.category === image.category
            : true),
    )
    .sort(
      (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at),
    );
}

function destinationLabel(image: SiteImage): string {
  if (image.placement === "home") {
    return HOME_SLOTS.find((slot) => slot.key === image.slot)?.label ?? "Home page";
  }
  if (image.placement === "experience") {
    return EXPERIENCE_SECTIONS.find((section) => section.key === image.category)?.label ?? "Experience page";
  }
  return "Gallery — Work page";
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const refreshRole = async (userId: string) => {
    setCheckingRole(true);
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(Boolean(data));
    setCheckingRole(false);
  };

  useEffect(() => {
    if (session?.user) void refreshRole(session.user.id);
    else setIsAdmin(false);
  }, [session?.user?.id]);

  return (
    <DhaRaPage activePath="/">
      <section className="border-b border-dhara-ink/15 bg-dhara-soft/40">
        <div className="dhara-container py-14 lg:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-dhara-ink">
            Studio admin
          </span>
          <h1 className="mt-5 max-w-[20ch] font-serif text-[clamp(2.3rem,4.8vw,3.8rem)] leading-[1.05] tracking-tight text-dhara-ink">
            Manage the photography on your website.
          </h1>
          <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-dhara-ink">
            Upload, reorder, caption or remove images for the home, Work and Experience pages.
            Changes appear on the website immediately.
          </p>
        </div>
      </section>

      <section>
        <div className="dhara-container py-12 lg:py-16">
          {checkingSession ? (
            <p className="text-base text-dhara-ink">Loading…</p>
          ) : !session ? (
            <AuthPanel />
          ) : checkingRole ? (
            <p className="text-base text-dhara-ink">Checking your access…</p>
          ) : !isAdmin ? (
            <ClaimPanel
              email={session.user.email ?? ""}
              onClaimed={() => void refreshRole(session.user.id)}
            />
          ) : (
            <ManagerPanel email={session.user.email ?? ""} userId={session.user.id} />
          )}
        </div>
      </section>
    </DhaRaPage>
  );
}

function NoticeLine({ notice }: { notice: Notice }) {
  if (!notice) return null;
  const tone =
    notice.kind === "error"
      ? "border-destructive/50 bg-destructive/10 text-destructive"
      : notice.kind === "success"
        ? "border-dhara-champagne bg-dhara-champagne/10 text-dhara-ink"
        : "border-dhara-ink/25 bg-dhara-soft/60 text-dhara-ink";
  return (
    <p role="status" className={`mt-6 border px-4 py-3 text-[15px] leading-relaxed ${tone}`}>
      {notice.text}
    </p>
  );
}

function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setNotice(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setNotice(
        error
          ? { kind: "error", text: error.message }
          : { kind: "success", text: "Account created. Check your email to confirm, then sign in." },
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setNotice({ kind: "error", text: error.message });
    }
    setBusy(false);
  };

  return (
    <div className="max-w-[30rem] border border-dhara-ink/20 bg-dhara-paper p-7 sm:p-9">
      <h2 className="font-serif text-2xl tracking-tight text-dhara-ink">
        {mode === "signin" ? "Sign in to the studio" : "Create your studio account"}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-dhara-ink/80">
        {mode === "signin"
          ? "Use the email and password you created for this website."
          : "New here? Create an account first — the very first account can claim owner access."}
      </p>
      <form onSubmit={submit} className="mt-7 flex flex-col gap-6">
        <label className="dhara-admin-field">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="dhara-admin-field">
          <span>Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="At least 8 characters"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center bg-dhara-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-dhara-ivory transition hover:bg-dhara-champagne hover:text-dhara-ink disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setNotice(null);
        }}
        className="mt-6 text-[15px] font-medium text-dhara-ink underline underline-offset-4 hover:text-dhara-champagne"
      >
        {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
      <NoticeLine notice={notice} />
    </div>
  );
}

function ClaimPanel({ email, onClaimed }: { email: string; onClaimed: () => void }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const claim = async () => {
    setBusy(true);
    setNotice(null);
    const { data: user } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (!userId) {
      setNotice({ kind: "error", text: "Please sign in again." });
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) {
      setNotice({
        kind: "error",
        text: "This website already has an owner account, so this account cannot be made an admin.",
      });
    } else {
      onClaimed();
    }
    setBusy(false);
  };

  return (
    <div className="max-w-[38rem] border border-dhara-ink/20 bg-dhara-paper p-7 sm:p-9">
      <h2 className="font-serif text-2xl tracking-tight text-dhara-ink">Claim owner access</h2>
      <p className="mt-4 text-base leading-relaxed text-dhara-ink/85">
        You are signed in as <span className="font-semibold text-dhara-ink">{email}</span>, but
        this account does not have admin access yet. The first account that claims owner access
        becomes the website owner — after that, no other account can claim it.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={claim}
          disabled={busy}
          className="inline-flex items-center bg-dhara-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-dhara-ivory transition hover:bg-dhara-champagne hover:text-dhara-ink disabled:opacity-60"
        >
          {busy ? "Please wait…" : "Claim admin access"}
        </button>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="text-[15px] font-medium text-dhara-ink underline underline-offset-4 hover:text-dhara-champagne"
        >
          Sign out
        </button>
      </div>
      <NoticeLine notice={notice} />
    </div>
  );
}

function ManagerPanel({ email, userId }: { email: string; userId: string }) {
  const queryClient = useQueryClient();
  const { data: images = [], isLoading } = useSiteImages();
  const [destination, setDestination] = useState("home:hero");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["site-images"] });
  };

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      setNotice({ kind: "error", text: "Choose at least one image first." });
      return;
    }
    setBusy(true);
    setNotice(null);
    const { placement, value } = parseDestination(destination);
    const isHeroUpload = placement === "home" && value === "hero";

    try {
      const existingCount = images.filter(
        (row) =>
          row.placement === placement &&
          (placement === "home"
            ? row.slot === value
            : placement === "experience"
              ? row.category === value
              : true),
      ).length;

      for (const [index, file] of files.entries()) {
        const uploadFile = await optimizeImageForUpload(file, isHeroUpload);
        const extension = uploadFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${placement}/${value}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from(IMAGE_BUCKET)
          .upload(path, uploadFile, { contentType: uploadFile.type, upsert: false });
        if (uploadError) throw uploadError;

        const { error: insertError } = await supabase.from("site_images").insert({
          placement,
          slot: placement === "home" ? value : null,
          category: placement === "gallery" || placement === "experience" ? value : null,
          storage_path: path,
          caption: caption.trim() === "" ? null : caption.trim(),
          sort_order: existingCount + index + 1,
          created_by: userId,
        });
        if (insertError) {
          await supabase.storage.from(IMAGE_BUCKET).remove([path]);
          throw insertError;
        }
      }
      setFiles([]);
      setCaption("");
      setNotice({
        kind: "success",
        text: `${files.length} image${files.length > 1 ? "s" : ""} uploaded — they are live on the website now.`,
      });
      invalidate();
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Upload failed. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (image: SiteImage) => {
    setNotice(null);
    if (!window.confirm("Remove this photo from the website? This cannot be undone.")) return;
    const { error: dbError } = await supabase.from("site_images").delete().eq("id", image.id);
    if (dbError) {
      setNotice({ kind: "error", text: dbError.message });
      return;
    }
    await supabase.storage.from(IMAGE_BUCKET).remove([image.storage_path]);
    setNotice({ kind: "success", text: "Photo removed." });
    invalidate();
  };

  const move = async (image: SiteImage, direction: -1 | 1) => {
    setNotice(null);
    const group = sameGroup(images, image);
    const index = group.findIndex((row) => row.id === image.id);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= group.length) return;
    const reordered = [...group];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(target, 0, moved);

    const results = await Promise.all(
      reordered.map((row, order) =>
        supabase.from("site_images").update({ sort_order: order + 1 }).eq("id", row.id),
      ),
    );
    if (results.some((result) => result.error)) {
      setNotice({ kind: "error", text: "Could not save the new order. Please try again." });
      return;
    }
    invalidate();
  };

  const saveCaption = async (image: SiteImage, next: string) => {
    setNotice(null);
    const value = next.trim() === "" ? null : next.trim();
    if (value === (image.caption ?? null)) return;
    const { error } = await supabase
      .from("site_images")
      .update({ caption: value })
      .eq("id", image.id);
    if (error) {
      setNotice({ kind: "error", text: "Could not save the caption. Please try again." });
      return;
    }
    setNotice({ kind: "success", text: "Caption saved." });
    invalidate();
  };

  const homeImages = images.filter((image) => image.placement === "home");
  const galleryImages = images.filter((image) => image.placement === "gallery");
  const experienceImages = images.filter((image) => image.placement === "experience");
  const heroCount = homeImages.filter((image) => image.slot === "hero").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-dhara-ink/20 pb-6">
        <p className="text-[15px] text-dhara-ink">
          Signed in as <span className="font-semibold">{email}</span>
        </p>
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="border border-dhara-ink/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-dhara-ink transition hover:border-dhara-champagne hover:text-dhara-champagne"
        >
          Sign out
        </button>
      </div>

      <NoticeLine notice={notice} />

      <form onSubmit={upload} className="mt-12 space-y-8">
        <div className="border border-dhara-ink/20 bg-dhara-paper p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dhara-champagne">
            Step 1 — Where should the photos go?
          </p>
          <label className="dhara-admin-field mt-5 max-w-[34rem]">
            <span>Destination</span>
            <select
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            >
              <optgroup label="Home page">
                {HOME_SLOTS.map((slot) => (
                  <option key={slot.key} value={`home:${slot.key}`}>{slot.label}</option>
                ))}
              </optgroup>
              <optgroup label="Gallery">
                <option value="gallery:all">Gallery (Work page)</option>
              </optgroup>
              <optgroup label="Experience page">
                {EXPERIENCE_SECTIONS.map((section) => (
                  <option key={section.key} value={`experience:${section.key}`}>{section.label}</option>
                ))}
              </optgroup>
            </select>
          </label>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-dhara-ink/80">
            The opening frames on the home page cycle through up to 5 photos. Hero uploads are automatically made lighter for fast loading. Everything else shows the photos in the order listed below.
          </p>
        </div>

        <div className="border border-dhara-ink/20 bg-dhara-paper p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-dhara-champagne">
            Step 2 — Choose your photos
          </p>
          <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-2">
            <label className="dhara-admin-field">
              <span>Images (up to {MAX_UPLOAD_FILES} at a time) or a zip file</span>
              <input
                type="file"
                accept="image/*,.zip,application/zip"
                multiple
                onChange={async (event) => {
                  const raw = Array.from(event.target.files ?? []);
                  const hasZip = raw.some((f) => f.name.toLowerCase().endsWith(".zip"));
                  if (hasZip) setNotice({ kind: "info", text: "Opening zip file…" });
                  try {
                    const picked = await expandZips(raw);
                    const limit = hasZip ? MAX_ZIP_FILES : MAX_UPLOAD_FILES;
                    setFiles(picked.slice(0, limit));
                    setNotice(
                      picked.length === 0
                        ? { kind: "error", text: "No photos found in the selection." }
                        : picked.length > limit
                          ? { kind: "info", text: `Only the first ${limit} photos will be uploaded.` }
                          : hasZip
                            ? {
                                kind: "success",
                                text: `${picked.length} photo${picked.length > 1 ? "s" : ""} found in the zip, ready to upload.`,
                              }
                            : null,
                    );
                  } catch {
                    setFiles([]);
                    setNotice({ kind: "error", text: "That zip file could not be opened." });
                  }
                }}
                className="cursor-pointer file:mr-4 file:border file:border-dhara-ink/40 file:bg-transparent file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-dhara-ink"
              />
            </label>
            <label className="dhara-admin-field">
              <span>Caption (optional — applies to every photo in this upload)</span>
              <input
                type="text"
                maxLength={120}
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="e.g. Anand & Meera, Hyderabad"
              />
            </label>
          </div>
          {files.length > 0 ? (
            <p className="mt-5 text-[15px] font-medium text-dhara-ink">
              {files.length} photo{files.length > 1 ? "s" : ""} ready:
              {" "}
              <span className="text-dhara-ink/75">
                {files.map((file) => file.name).join(", ")}
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center bg-dhara-ink px-10 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-dhara-ivory transition hover:bg-dhara-champagne hover:text-dhara-ink disabled:opacity-60"
          >
            {busy ? "Uploading…" : "Upload images"}
          </button>
          <span className="text-[15px] text-dhara-ink/75">
            JPG, PNG, WEBP, GIF or AVIF. Large photos are automatically lightened before upload. A zip can hold up to {MAX_ZIP_FILES} photos.
          </span>
        </div>
      </form>

      <div className="mt-16 space-y-16">
        <ImageGroup
          title="Home page frames"
          description={`Each frame keeps its own spot on the home page. The opening frames loop currently holds ${heroCount} of 5 photos.`}
          empty="No home page images yet — the editorial placeholders are shown until you upload."
          images={homeImages}
          labelFor={destinationLabel}
          onRemove={remove}
          onMove={move}
          onSaveCaption={saveCaption}
          isLoading={isLoading}
        />
        <ImageGroup
          title="Gallery"
          description="These photos appear on the Work page in the order listed here."
          empty="No gallery images yet — the editorial placeholders are shown until you upload."
          images={galleryImages}
          labelFor={destinationLabel}
          onRemove={remove}
          onMove={move}
          onSaveCaption={saveCaption}
          isLoading={isLoading}
        />
        <ImageGroup
          title="Experience page"
          description="Choose a named section above to place its photo. The first photo in each section is shown on the Experience page."
          empty="No Experience photos yet — the editorial placeholders are shown until you upload."
          images={experienceImages}
          labelFor={destinationLabel}
          onRemove={remove}
          onMove={move}
          onSaveCaption={saveCaption}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

function ImageGroup({
  title,
  description,
  empty,
  images,
  labelFor,
  onRemove,
  onMove,
  onSaveCaption,
  isLoading,
}: {
  title: string;
  description: string;
  empty: string;
  images: SiteImage[];
  labelFor: (image: SiteImage) => string;
  onRemove: (image: SiteImage) => Promise<void>;
  onMove: (image: SiteImage, direction: -1 | 1) => Promise<void>;
  onSaveCaption: (image: SiteImage, value: string) => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-dhara-ink/20 pb-4">
        <h2 className="font-serif text-[clamp(1.6rem,2.8vw,2.2rem)] tracking-tight text-dhara-ink">
          {title}
        </h2>
        <span className="border border-dhara-ink/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-dhara-ink">
          {images.length} photo{images.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-dhara-ink/80">{description}</p>
      {isLoading ? (
        <p className="mt-6 text-[15px] text-dhara-ink">Loading images…</p>
      ) : images.length === 0 ? (
        <p className="mt-6 text-[15px] leading-relaxed text-dhara-ink/80">{empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              label={labelFor(image)}
              onRemove={onRemove}
              onMove={onMove}
              onSaveCaption={onSaveCaption}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageCard({
  image,
  label,
  onRemove,
  onMove,
  onSaveCaption,
}: {
  image: SiteImage;
  label: string;
  onRemove: (image: SiteImage) => Promise<void>;
  onMove: (image: SiteImage, direction: -1 | 1) => Promise<void>;
  onSaveCaption: (image: SiteImage, value: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(image.caption ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(image.caption ?? "");
  }, [image.caption]);

  const dirty = draft !== (image.caption ?? "");

  const save = async () => {
    setSaving(true);
    await onSaveCaption(image, draft);
    setSaving(false);
  };

  return (
    <figure className="flex h-full flex-col border border-dhara-ink/25 bg-dhara-paper">
      <div className="relative overflow-hidden">
        <img
          src={image.url}
          alt={image.caption ?? label}
          className="block h-auto w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="flex flex-1 flex-col gap-4 border-t border-dhara-ink/20 p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-dhara-ink">
          {label}
        </span>
        <label className="dhara-admin-field">
          <span>Caption</span>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={120}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Add a caption"
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={() => void save()}
              disabled={!dirty || saving}
              className="shrink-0 border border-dhara-ink/40 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-dhara-ink transition hover:border-dhara-champagne hover:text-dhara-champagne disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </label>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-dhara-ink/15 pt-3">
          <button
            type="button"
            onClick={() => void onMove(image, -1)}
            className="border border-dhara-ink/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-dhara-ink transition hover:border-dhara-champagne hover:text-dhara-champagne"
          >
            ← Move up
          </button>
          <button
            type="button"
            onClick={() => void onMove(image, 1)}
            className="border border-dhara-ink/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-dhara-ink transition hover:border-dhara-champagne hover:text-dhara-champagne"
          >
            Move down →
          </button>
          <button
            type="button"
            onClick={() => void onRemove(image)}
            className="ml-auto border border-destructive/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
          >
            Remove
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
