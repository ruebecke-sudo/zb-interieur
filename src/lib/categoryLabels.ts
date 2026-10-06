export type CategoryLabels = [string, string, string, string]

/** Used until a workspace has its own names (or before migration 009 has run). */
export const DEFAULT_CATEGORY_LABELS: CategoryLabels = ['Marke', 'Typ', 'Bereich', 'Stil']

export function toCategoryLabels(value: unknown): CategoryLabels {
  if (!Array.isArray(value) || value.length !== 4) return DEFAULT_CATEGORY_LABELS
  return value.map((label, index) => String(label || '').trim() || DEFAULT_CATEGORY_LABELS[index]) as CategoryLabels
}
