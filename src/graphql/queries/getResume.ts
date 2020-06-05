import gql from 'graphql-tag';

export const GET_RESUME = gql`
  query GetResume($auth: authType!, $token: String) {
    getResume(auth: $auth, token: $token) {
      token
      resume {
        ... on InvoiceType {
          chain_address
          confirmed_at
          created_at
          description
          description_hash
          expires_at
          id
          is_canceled
          is_confirmed
          is_held
          is_private
          is_push
          received
          received_mtokens
          request
          secret
          tokens
          type
          date
        }
        ... on PaymentType {
          created_at
          destination
          destination_node {
            node {
              alias
            }
          }
          fee
          fee_mtokens
          hops {
            node {
              alias
            }
          }
          id
          index
          is_confirmed
          is_outgoing
          mtokens
          request
          safe_fee
          safe_tokens
          secret
          tokens
          type
          date
        }
      }
    }
  }
`;
