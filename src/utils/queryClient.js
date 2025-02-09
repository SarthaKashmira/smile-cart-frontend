import { QUERY_KEYS } from "constants/query";

import { QueryClient, QueryCache } from "react-query";
// persist query client function below helps to persist the state of the queryClient
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
// to cache the values of queryClient we can create a persistor usming below function of react-query

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  // here we have set the default options like refetching on window/tab focus as false.
  // and also the stale time or time after which api is refetched is 1hr
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3_600_000,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
  maxAge: Infinity,
  // should dehydrate option helps to let know which keys to serialize based on query keys
  dehydrateOptions: {
    shouldDehydrateQuery: ({ queryKey }) =>
      [QUERY_KEYS.COUNTRIES, QUERY_KEYS.STATES].some(key =>
        queryKey.includes(key)
      ),
  },
});

export default queryClient;
