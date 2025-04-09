export function formatZodError(err: { fieldErrors: Record<string, string[]> }) {
  const result: Record<string, string> = {};
  for (const key in err.fieldErrors) {
    result[key] = err.fieldErrors[key][0];
  }
  return result;
}
