import axios from "axios";
import type { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";

interface RequestParams {
	[key: string]: string | number | boolean;
}

type PostData = Record<string, string | number | boolean | object> | FormData;

const DEFAULT_URL: string = "http://localhost:8000/";

class ApiService {
	private axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: DEFAULT_URL,
		});
	}

	/**
	 * Sends a GET request to the specified URL with the provided parameters and headers.
	 *
	 * @param {string} url - The URL to send the GET request to.
	 * @param {RequestParams} [params] - The parameters to include in the GET request.
	 * @param {AxiosRequestHeaders} [headers] - The headers to include in the GET request.
	 * @returns {Promise<{ data: T, status: number }>} The response data and status code from the API.
	 */
	async get<T>(
		url: string,
		params?: RequestParams,
		headers?: AxiosRequestHeaders,
	): Promise<{ data: T; status: number }> {
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.get(url, {
				params: params,
				headers: headers,
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error("Error while fetching data from the API", error);
			throw new Error("Error while fetching data from the API");
		}
	}

	/**
	 * Sends a POST request to the specified URL with the provided data, query parameters, and headers.
	 *
	 * @param {string} url - The URL to send the POST request to.
	 * @param {PostData} data - The data to include in the POST request.
	 * @param {RequestParams} [params] - The query parameters to include in the URL.
	 * @param {AxiosRequestHeaders} [headers] - The headers to include in the POST request.
	 * @returns {Promise<{ data: T, status: number }>} The response data and status code from the API.
	 */
	async post<T>(
		url: string,
		data?: PostData,
		params?: RequestParams,
		headers?: AxiosRequestHeaders,
	): Promise<{ data: T; status: number }> {
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.post(
				url,
				data,
				{
					params,
					headers,
				},
			);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error("Error while posting data to the API", error);
			throw new Error("Error while posting data to the API");
		}
	}

	/**
	 * Sends a PATCH request to the specified URL with the provided data and headers.
	 *
	 * @param {string} url - The URL to send the PATCH request to.
	 * @param {PostData} data - The data to include in the PATCH request.
	 * @param {AxiosRequestHeaders} [headers] - The headers to include in the PATCH request.
	 * @returns {Promise<{ data: T, status: number }>} The response data and status code from the API.
	 */
	async patch<T>(
		url: string,
		data: PostData,
		headers?: AxiosRequestHeaders,
	): Promise<{ data: T; status: number }> {
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.patch(
				url,
				data,
				{
					headers: headers,
				},
			);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error("Error while patching data to the API", error);
			throw new Error("Error while patching data to the API");
		}
	}

	/**
	 * Sends a DELETE request to the specified URL with the provided parameters and headers.
	 *
	 * @param {string} url - The URL to send the DELETE request to.
	 * @param {RequestParams} [params] - The parameters to include in the DELETE request.
	 * @param {AxiosRequestHeaders} [headers] - The headers to include in the DELETE request.
	 * @returns {Promise<{ data: T, status: number }>} The response data and status code from the API.
	 */
	async delete<T>(
		url: string,
		params?: RequestParams,
		headers?: AxiosRequestHeaders,
	): Promise<{ data: T; status: number }> {
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.delete(url, {
				params: params,
				headers: headers,
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error("Error while deleting data from the API", error);
			throw new Error("Error while deleting data from the API");
		}
	}

	/**
	 * Sends a DELETE request to the specified URL with the provided data, parameters and headers.
	 *
	 * @param {string} url - The URL to send the DELETE request to.
	 * @param {PostData} data - The data to include in the DELETE request body.
	 * @param {RequestParams} [params] - The parameters to include in the DELETE request.
	 * @param {AxiosRequestHeaders} [headers] - The headers to include in the DELETE request.
	 * @returns {Promise<{ data: T, status: number }>} The response data and status code from the API.
	 */
	async deleteWithBody<T>(
		url: string,
		data: PostData,
		params?: RequestParams,
		headers?: AxiosRequestHeaders,
	): Promise<{ data: T; status: number }> {
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.delete(url, {
				data: data,
				params: params,
				headers: headers,
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error("Error while deleting data from the API", error);
			throw new Error("Error while deleting data from the API");
		}
	}
}

const api = new ApiService();
export default api;
