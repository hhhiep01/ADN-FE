import axios from "axios";

interface Body {
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH";
  contentType?: string;
  url: string;
  data?: unknown; // Sử dụng unknown nếu chưa rõ kiểu dữ liệu
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  responseType?: "json" | "blob" | "arraybuffer" | "text";
  authorization?: string;
}

const request = (arg: Body) => {
  const token = localStorage.getItem("token");
  const {
    method,
    contentType = arg.data instanceof FormData
      ? "multipart/form-data"
      : "application/json",
    url,
    data,
    params,
    signal,
    responseType = "json",
    authorization = `bearer ${token ?? ""}`,
  } = arg;

  const source = axios.CancelToken.source();
  if (signal) {
    signal.addEventListener("abort", () => {
      source.cancel();
    });
  }

  return axios
    .request({
      method,
      headers: {
        "content-type": contentType,
        Authorization: authorization,
        "ngrok-skip-browser-warning": true,
      },
      url: url,
      data,
      params,
      responseType,
      cancelToken: source.token,
    })
    .catch((e) => {
      if (axios.isCancel(e)) {
        throw new DOMException("Aborted", "AbortError");
      }
      if (e.response) {
        let errorMessage = e.response.data.errorMessage;
        if (
          !errorMessage &&
          typeof e.response.data === "object" &&
          e.response.data !== null
        ) {
          errorMessage = JSON.stringify(e.response.data);
        }
        const error = new Error(`Error: ${errorMessage || "Request failed"}`);
        (error as any).response = e.response;
        throw error;
      } else if (e.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error(e.message);
      }
    });
};

const httpClient = {
  request: (arg: Body) => {
    console.log("Outgoing Request:", arg);
    return request(arg);
  },
  get: (arg: Omit<Body, "method">) => request({ ...arg, method: "GET" }),
  post: (arg: Omit<Body, "method">, isMultipart = false) => {
    const contentType = isMultipart
      ? "multipart/form-data"
      : "application/json";
    return request({ ...arg, method: "POST", contentType });
  },
  put: (arg: Omit<Body, "method">) => request({ ...arg, method: "PUT" }),
  delete: (arg: Omit<Body, "method">) => request({ ...arg, method: "DELETE" }),
  option: (arg: Omit<Body, "method">) => request({ ...arg, method: "OPTIONS" }),
  patch: (arg: Omit<Body, "method">) => request({ ...arg, method: "PATCH" }),
};

export default httpClient;
