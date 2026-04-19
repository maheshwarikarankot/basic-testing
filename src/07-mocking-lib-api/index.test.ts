import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: (...args: unknown[]) => unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {
  let mockAxiosInstance: { get: jest.Mock };

  const relativePath = '/posts';
  const mockData = [{ id: 1, title: 'Post 1' }];

  beforeEach(() => {
    mockAxiosInstance = { get: jest.fn() };
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);

    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);

    expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockData);
  });
});
