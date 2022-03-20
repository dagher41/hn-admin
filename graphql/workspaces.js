import { gql } from "@apollo/client";


export const WORKSAPCE_SHOW = gql`
{
  messages(order_by: {createdAt: asc}) {
    id
    body
    createdAt
    isFlagged
    user {
      id
      firstName
      lastName
    }
  }
}
`;