import apiLinks from "../MainService";
import httpClient from "../../httpClient/httpClient";

export const getCommentsByBlogId = (blogId: number) => {
  return httpClient.get({ url: apiLinks.Comment.getByBlogId(blogId) });
};

export const postComment = (content: string, blogId: number, userName?: string) => {
  return httpClient.post({ url: apiLinks.Comment.create, data: { content, blogId, userName } });
};

export const updateComment = (id: number, content: string, blogId: number) => {
  return httpClient.put({ url: apiLinks.Comment.update, data: { id, content, blogId } });
};

export const deleteComment = (id: number) => {
  return httpClient.delete({ url: apiLinks.Comment.delete(id) });
}; 