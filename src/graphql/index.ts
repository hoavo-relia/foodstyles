import {gql} from '@apollo/client';

export const GET_CARDS = gql`
  query {
    cards {
      id
      name
    }
  }
`;

export const ADD_CARD = gql`
  mutation CreateCard($name: NonEmptyString!) {
    createCard(
      data: {
        name: $name
        minPrice: null
        maxPrice: null
        locationTypeIds: []
        locationCuisineTypeIds: []
        dishTypeIds: []
        courseTypeIds: []
        dietIds: []
        excludedIngredientIds: []
      }
    ) {
      id
      name
    }
  }
`;

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;

export const SHARE_CARD = gql`
  mutation ShareCard($id: ID!) {
    shareCard(id: $id)
  }
`;

export const DUPLICATE_CARD = gql`
  mutation DuplicateCard($id: ID!) {
    duplicateCard(id: $id) {
      id
      name
    }
  }
`;
