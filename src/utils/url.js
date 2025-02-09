import { keysToSnakeCase } from "neetocist";
import { stringify } from "qs";
import { toPairs, omit, pipe, isEmpty } from "ramda";

export const buildUrl = (route, params) => {
  const placeHolders = [];
  toPairs(params).forEach(([key, value]) => {
    if (route.includes(`:${key}`)) {
      placeHolders.push(key); // we took the keys in the placeholder
      route = route.replace(`:${key}`, encodeURIComponent(value));
    }
  });

  const queryParams = pipe(
    omit(placeHolders),
    keysToSnakeCase,
    stringify
  )(params); // here before putting query params we will exclude them

  return isEmpty(queryParams) ? route : `${route}?${queryParams}`;
};
