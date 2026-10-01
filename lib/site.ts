/** Public origin of the deployed gallery/registry. Set NEXT_PUBLIC_SITE_URL on Vercel. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecsight-design-system.vercel.app").replace(/\/$/, "")

export const registryNamespace = "@ecsight"

export const installCommand = (slug: string) => `npx shadcn@latest add ${registryNamespace}/${slug}`
