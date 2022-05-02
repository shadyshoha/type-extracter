interface FetchInterface {
  stringify?: boolean;
  token?: string;
  path: string;
  headers?: any;
  param?: any;
  data?: any;
  body?: any;
  org?: string;
  json?: boolean;
  query?: Record<string, any>;
}

export const FETCH = ({
  token,
  path = "",
  headers = {},
  data,
  param,
  query,
  body = {},
  json = true,
  org,
}: FetchInterface) => {
  return true;
};
