import { GraphQLClient, GraphQLRequestClient } from './graphql-request-client';
import debug from 'debug';


// The default query for request redirects of site
const defaultQuery = /* GraphQL */ `
  query RedirectsQuery($siteName: String!) {
    site {
      siteInfo(site: $siteName) {
        whatever
      }
    }
  }
`;

export type GraphQLRedirectsServiceConfig = {
  /**
   * Your Graphql endpoint
   */
  endpoint: string;
};

/**
 *  The GraphQLRedirectsService class is used to query the JSS redirects using Graphql endpoint
 */
export class GraphQLRedirectsService {
  private graphQLClient: GraphQLClient;

  protected get query(): string {
    return defaultQuery;
  }

  /**
   * Creates an instance of graphQL redirects service with the provided options
   * @param {GraphQLRedirectsServiceConfig} options instance
   */
  constructor(private options: GraphQLRedirectsServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  /**
   * Fetch an array of redirects from API
   * @returns Promise<RedirectInfo[]>
   * @throws {Error} if the siteName is empty.
   */
  async fetchRedirects(): Promise<any> {
    try {
      const redirectsResult = await this.graphQLClient.request<any>(this.query);

      return redirectsResult?.site?.siteInfo?.redirects || [];
    } catch (error) {
      console.log(`catched: ${error}`);
      return [];
    }
  }

  /**
   * Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
   * library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
   * want to use something else.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    return new GraphQLRequestClient(this.options.endpoint, {
      debugger: debug(`mock:redirects`),
    });
  }
}
