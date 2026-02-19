export const encodeHashtags = (str: string) => {
  return str.replace('#', '%23')
}