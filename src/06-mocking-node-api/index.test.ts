import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');

jest.mock('fs/promises');

jest.mock('path');

const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedJoin = join as jest.MockedFunction<typeof join>;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);

  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 500;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);

    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 500;

    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(interval * 3);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockDirname = '/mocked/dir';
  const mockPathToFile = 'test.txt';
  const mockFullPath = `${mockDirname}/${mockPathToFile}`;
  const mockFileContent = 'Hello, world!';
  const mockBuffer = Buffer.from(mockFileContent);

  beforeEach(() => {
    mockedJoin.mockReturnValue(mockFullPath);
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(mockPathToFile);

    expect(mockedJoin).toHaveBeenCalledTimes(1);
    expect(mockedJoin).toHaveBeenCalledWith(expect.any(String), mockPathToFile);
  });

  test('should return null if file does not exist', async () => {
    mockedJoin.mockReturnValue(mockFullPath);
    mockedExistsSync.mockReturnValue(false);

    const result = await readFileAsynchronously(mockPathToFile);

    expect(mockedExistsSync).toHaveBeenCalledWith(mockFullPath);
    expect(result).toBeNull();
    expect(mockedReadFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    mockedJoin.mockReturnValue(mockFullPath);
    mockedExistsSync.mockReturnValue(true);
    mockedReadFile.mockResolvedValue(mockBuffer);

    const result = await readFileAsynchronously(mockPathToFile);

    expect(mockedExistsSync).toHaveBeenCalledWith(mockFullPath);
    expect(mockedReadFile).toHaveBeenCalledWith(mockFullPath);
    expect(result).toBe(mockFileContent);
  });
});
