import { api } from "./api";

const API_URL: string = import.meta.env.VITE_API_URL;

let MESSAGE_URL: string;

if (import.meta.env.PROD) {
  MESSAGE_URL = `${API_URL}/api/v1/messages`;
} else {
  MESSAGE_URL = "/api/v1/messages";
}

export const messageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (_id) => ({
        url: `${MESSAGE_URL}/message/${_id}`,
        method: "GET",
      }),
    }),
    sendMessage: builder.mutation({
      query: ({ _id, ...payload }) => ({
        url: `${MESSAGE_URL}/message/send-message/${_id}`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi;
