import { ApolloClient, InMemoryCache } from "@apollo/client";
import buildHasuraProvider, { buildFields } from "ra-data-hasura";
import { WORKSAPCE_SHOW } from "../graphql/workspaces";
import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export async function buildDataProvider(authProvider, setDataProvider) {
  const headers = {};
  try {
    let user = await authProvider.getAuthUser();
    const idToken = await user.auth.currentUser.getIdToken(true);
    headers["Authorization"] = `Bearer ${idToken}`;
  } catch (error) {
    console.log("error no user logged in ");
  }

  const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_HOST}/v1/graphql`,
    cache: new InMemoryCache(),
    headers,
  });

  const extraOpts = {
    buildFields: (type, fetchType) => {
      const defaultFields = buildFields(type, fetchType);
      if (type.name === "workspaces" && fetchType === "GET_ONE") {
        const relatedEntities = WORKSAPCE_SHOW.definitions[0].selectionSet.selections;
        defaultFields.push(...relatedEntities);
      }
      return defaultFields;
    },
  };

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("idToken")}`,
      },
    };
  });

  const httpLink = createHttpLink({ uri: "http://localhost:8080/v1/graphql" });
  const clientOptionsWithAuth = { link: authLink.concat(httpLink) };

  const dataProvider = await buildHasuraProvider(
    { clientOptions: clientOptionsWithAuth },
    extraOpts
  );
  // const dataProvider = await buildHasuraProvider({ client }, extraOpts);
  setDataProvider(() => dataProvider);
}
