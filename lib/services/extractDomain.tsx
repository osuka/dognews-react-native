export const extractDomain = (url: string) => {
  const regex = /.*\/\/([^/]*).*/;
  const matches = regex.exec(url);
  if (!matches || matches.length <= 1) {
    return url;
  }
  return matches[1];
};
