import React from 'react';
import {ApolloProvider, client} from './graphql/apollo';

import Cards from './screens/Cards';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Cards />
    </ApolloProvider>
  );
};

export default App;
