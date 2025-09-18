export default function newDateUtc(): Date {
  return new Date(new Date().toUTCString());
}
