# UI Redesign Report

**Commit:** `03c9efd`
**Date:** 2026-06-19

## Files Changed (src/components/)

14 component files were modified under `src/components/`:

### Layout.tsx
- Outer div: removed `bg-gray-50` (now just `min-h-screen`)
- Nav bar: `bg-white border-t border-gray-200` -> `bg-white/80 backdrop-blur-sm border-t border-primary-100 rounded-t-3xl`

### Avatar
- `AvatarCanvas.tsx` — `rounded-xl` -> `rounded-2xl`
- `AvatarControls.tsx` — 5x `hover:border-indigo-300` -> `hover:border-primary-300`

### Capture
- `CameraCapture.tsx` — 2x `rounded-xl` -> `rounded-2xl`
- `CaptureTab.tsx` — `bg-gray-100` -> `bg-primary-50`, `rounded-xl` -> `rounded-2xl`, `shadow-sm` -> `shadow-md`
- `FileUpload.tsx` — `rounded-xl` -> `rounded-2xl`, `border-indigo-500` -> `border-primary-400`, `bg-indigo-50` -> `bg-primary-50`
- `ResultCard.tsx` — `rounded-xl` -> `rounded-2xl`, `shadow-sm` -> `shadow-md`, `bg-indigo-100` -> `bg-primary-100`, `text-indigo-700` -> `text-primary-600`, `bg-gray-100` -> `bg-primary-50`, `bg-pink-50` -> `bg-primary-100`, `text-pink-600` -> `text-primary-500`, `hover:bg-indigo-50` -> `hover:bg-primary-50`, `hover:bg-gray-50` -> `hover:bg-warm-50`

### Profile
- `ProfileForm.tsx` — 4x `rounded-xl` -> `rounded-2xl`, 4x `shadow-sm` -> `shadow-md`
- `StyleQuiz.tsx` — `rounded-xl` -> `rounded-2xl`, `border-indigo-500` -> `border-primary-400`, `bg-indigo-50` -> `bg-primary-50`, `text-indigo-700` -> `text-primary-600`

### Recommendation
- `RecommendationCard.tsx` — `rounded-xl` -> `rounded-2xl`, `shadow-sm` -> `shadow-md`, `bg-gray-50` -> `bg-warm-50`, `hover:bg-gray-50` -> `hover:bg-warm-50`
- `RecommendationList.tsx` — `hover:border-indigo-300` -> `hover:border-primary-300`
- `WeightSliders.tsx` — `rounded-xl` -> `rounded-2xl`, `shadow-sm` -> `shadow-md`

### Wardrobe
- `WardrobeCard.tsx` — `rounded-xl` -> `rounded-2xl`, `shadow-sm` -> `shadow-md`, `bg-gray-50` -> `bg-warm-50`
- `WardrobeEditor.tsx` — 3x `rounded-xl` -> `rounded-2xl`

## Unchanged Files

3 component files had no matching replacement patterns and were left untouched:
- `WardrobeGrid.tsx`
- `WardrobeFilter.tsx`
- `AvatarSVG.tsx`

## Replacement Summary

| Rule | Pattern | Replacement | Occurrences |
|------|---------|-------------|-------------|
| 1 | `indigo-600` | `primary-500` | — (no matches) |
| 2 | `indigo-500` | `primary-400` | 2 |
| 3 | `indigo-700` | `primary-600` | 2 |
| 4 | `indigo-100` | `primary-100` | 1 |
| 5 | `indigo-50` | `primary-50` | 3 |
| 6 | `indigo-300` | `primary-300` | 6 |
| 7 | `bg-gray-50` | `bg-warm-50` | 4 |
| 8 | `bg-gray-100` | `bg-primary-50` | 2 |
| 9 | `shadow-sm` | `shadow-md` | 7 |
| 10 | `rounded-xl` | `rounded-2xl` | 16 |
| 11 | `pink-50` | `primary-100` | 1 |
| 12 | `pink-600` | `primary-500` | 1 |
| 13 | `text-indigo-600` | `text-primary-500` | — (no matches) |

## TypeScript Check

`npx tsc --noEmit --pretty` passed with **zero errors**.

## Commit

```
03c9efd feat: redesign UI -- rose palette, warm bg, rounded design
```
