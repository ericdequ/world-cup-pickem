/** Join truthy class names. Keeps conditional Tailwind classes readable. */
export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");
