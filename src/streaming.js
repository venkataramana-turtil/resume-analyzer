export const SECTION_KEYS   = ['candidate','ats','improvement_plan','salary','personal_salary','market_fit','candidate_vs_market'];
export const SECTION_KEYS_A = ['candidate','ats','improvement_plan'];
export const SECTION_KEYS_B = ['salary','personal_salary','market_fit','candidate_vs_market'];

export const extractTopLevelKey = (str, key) => {
  const searchKey = `"${key}"`;
  let keyIdx = str.indexOf(searchKey);
  while (keyIdx !== -1) {
    let i = keyIdx + searchKey.length;
    while (i < str.length && /\s/.test(str[i])) i++;
    if (str[i] !== ':') { keyIdx = str.indexOf(searchKey, keyIdx + 1); continue; }
    i++;
    while (i < str.length && /\s/.test(str[i])) i++;
    if (str[i] !== '{') { keyIdx = str.indexOf(searchKey, keyIdx + 1); continue; }
    const start = i;
    let depth = 0, inString = false, escape = false;
    for (; i < str.length; i++) {
      if (escape)              { escape = false; continue; }
      if (str[i] === '\\' && inString) { escape = true; continue; }
      if (str[i] === '"')      { inString = !inString; continue; }
      if (inString)            continue;
      if (str[i] === '{')      depth++;
      else if (str[i] === '}') { depth--; if (depth === 0) { try { return JSON.parse(str.slice(start, i + 1)); } catch { return null; } } }
    }
    break;
  }
  return null;
};
