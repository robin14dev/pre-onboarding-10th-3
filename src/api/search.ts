import apiRequest from "./index";

const RESOURCE = "/search";
const LIMIT = 10;

export const getRecommendTodoList = async (query: string, page: number) => {
  try {
    const response = await apiRequest.get(
      `${RESOURCE}?q=${query}&page=${page}&limit=${LIMIT}`
    );

    return response;
  } catch (error) {
    throw new Error("API getRecommendTodoList error");
  }
};
