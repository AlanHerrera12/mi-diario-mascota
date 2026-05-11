import { GEMS, STREAK_MILESTONES, MIN_RECORDING_SECONDS } from '../src/constants';

describe('GEMS constants', () => {
  it('DAILY_TALK is positive', () => expect(GEMS.DAILY_TALK).toBeGreaterThan(0));
  it('MINI_GAME_COMPLETE is positive', () => expect(GEMS.MINI_GAME_COMPLETE).toBeGreaterThan(0));
  it('STREAK_7_DAYS > DAILY_TALK', () => expect(GEMS.STREAK_7_DAYS).toBeGreaterThan(GEMS.DAILY_TALK));
  it('STREAK_30_DAYS > STREAK_7_DAYS', () => expect(GEMS.STREAK_30_DAYS).toBeGreaterThan(GEMS.STREAK_7_DAYS));
  it('PREMIUM_BONUS_MULTIPLIER > 1', () => expect(GEMS.PREMIUM_BONUS_MULTIPLIER).toBeGreaterThan(1));
});

describe('STREAK_MILESTONES', () => {
  it('is sorted ascending', () => {
    const sorted = [...STREAK_MILESTONES].sort((a, b) => a - b);
    expect([...STREAK_MILESTONES]).toEqual(sorted);
  });
  it('includes 7 and 30', () => {
    expect(STREAK_MILESTONES).toContain(7);
    expect(STREAK_MILESTONES).toContain(30);
  });
});

describe('MIN_RECORDING_SECONDS', () => {
  it('is at least 60 seconds', () => expect(MIN_RECORDING_SECONDS).toBeGreaterThanOrEqual(60));
});
