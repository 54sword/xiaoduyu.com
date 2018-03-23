export const saveAccessToken = ({ expires, access_token }) => {
  return { type: 'ADD_ACCESS_TOKEN', expires, access_token }
}
