import { describe, expect, it } from 'vitest';

import { getPaginationRange } from '../getPaginationRange';

describe('getPaginationRange', () => {
  it('до 7 страниц показывает все номера', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('в начале длинного списка — многоточие перед последней страницей', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
  });

  it('в середине — многоточия с обеих сторон', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'ellipsis', 10, 11, 12, 'ellipsis', 20]);
  });

  it('в конце — многоточие после первой страницы', () => {
    expect(getPaginationRange(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });
});
