export function snakeToCamel(s: string): string {
  if (s.includes('_')) {
    return s
      .split('_')
      .map((word, i) => {
        if (i === 0) {
          // if first symbol is "_" then skip it
          return word ? word[0] + word.substring(1).toLowerCase() : '';
        } else {
          return capitalize(word.toLowerCase());
        }
      })
      .join('');
  } else {
    return s;
  }
}

export function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1);
}

export function camelCase(s: string): string {
  return s.substring(0, 1).toLowerCase() + s.substring(1);
}
