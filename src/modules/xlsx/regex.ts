export const PASS_REGEX = /[A-Z]{1,2}([7-9]|[0-2][0-2][0-4]|[0-2][0-2])/; // used rows
export const REJECT_REGEX = /[A-Z]{1,2}([1-6]$|[2-9][2-9][5-9]$)/; // unused rows
export const NUMBER_REGEX = /\d+/;
export const COLUMN_REGEX = /[A-Z]{1,2}/;
export const GROUP_NAME_REGEX = /[A-Z]+-\d+/; // match 'A-1', 'FAF-151', ...
export function rowRegex(row: number): RegExp {
  return new RegExp('[A-Z]+' + row + '$');
}
