import { api } from "../services/api";

const API_URL: string = import.meta.env.VITE_API_URL;

let FRIEND_URL: string;

if (import.meta.env.PROD) {
  FRIEND_URL = `${API_URL}/api/v1/friends`;
} else {
  FRIEND_URL = "/api/v1/friends";
}

export const friendApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendFriendRequest: builder.mutation({
      query: (_id) => ({
        url: `${FRIEND_URL}/friend/send-friend-request/${_id}}`,
        method: "POST",
      }),
    }),
    acceptFriendRequest: builder.mutation({
      query: (_id) => ({
        url: `${FRIEND_URL}/friend/accept-friend-request/${_id}`,
        method: "POST",
      }),
    }),
    rejectFriendRequest: builder.mutation({
      query: (_id) => ({
        url: `${FRIEND_URL}/friend/reject-friend-request/${_id}`,
        method: "POST",
      }),
    }),
    removeFriend: builder.mutation({
      query: (_id) => ({
        url: `${FRIEND_URL}/friend/remove-friend/${_id}`,
        method: "POST",
      }),
    }),
    showFriendList: builder.query({
      query: () => ({
        url: `${FRIEND_URL}/friend/friend-list`,
        method: "GET",
      }),
    }),
    showFriendRequests: builder.query({
      query: () => ({
        url: `${FRIEND_URL}/friend/friend-requests`,
        method: "GET",
      }),
    }),
    searchFriendToAdd: builder.mutation({
      query: (payload) => ({
        url: `${FRIEND_URL}/friend/search-friend`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendMutation,
  useSearchFriendToAddMutation,
  useSendFriendRequestMutation,
  useShowFriendListQuery,
  useShowFriendRequestsQuery,
} = friendApi;
