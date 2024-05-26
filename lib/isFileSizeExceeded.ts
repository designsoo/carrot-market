const MB = 1024 * 1024;

export const isFileSizeExceeded = (file: File, size: number) => file.size > size * MB;
