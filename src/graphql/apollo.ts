import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
export {ApolloProvider} from '@apollo/client';

const URL = 'https://api-dev.foodstyles.com/graphql';
const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM2LCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNjU0MDk4MjQyLCJleHAiOjE2NTQ3MDMwNDJ9.tg6cmFT12SCYme9J5BzhYfJkZPO3srFCKPrwdTb1QCcLL5_NeBOkrj6PQ_7iIWz2TeAPLqoHMXC2kIHfVlaJjEzQfakpzm_HfMicwZdB0L_nA0k7F1j9kzEpSFxVoCV_HjxeYRPYOBVtQKg1XTdoDj-REHne4J4Z_R5du0XEY8I8SQHeRq05RDigMgyucmGZ_9G8anQVEMpjfRSPsEfWX50HHkHzs1asGGxlGTkRYqL_UaZyfg2EBDAvi4m3Y2_6EeL50nw4LnZ9eG6mwkujU0Q6TwzJ5VNP42CoESzD6rwxsXowM2n_s9PyTFYOEqsc0zbEVVhFo9ALuHNh7XwsrQ';

const httpLink = createHttpLink({
  uri: URL,
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
