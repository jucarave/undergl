export function createUUID(): string {
  let date = new Date().getTime();
  const ret = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string): string => {
    const ran = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);

    return (c == 'x' ? ran : (ran & 0x3) | 0x8).toString(16);
  });

  return ret;
}
