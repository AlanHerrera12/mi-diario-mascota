import {
  aggregateEmotions,
  averageSentiment,
} from '../src/features/parental-controls/useParentDashboard';
import { buildTimelinePoints } from '../src/components/parent-ui/SentimentTimeline';
import type { WeeklyEntryRaw } from '../src/features/parental-controls/useParentDashboard';

// ---- aggregateEmotions ----

describe('aggregateEmotions', () => {
  it('returns empty array for no entries', () => {
    expect(aggregateEmotions([])).toEqual([]);
  });

  it('counts emotions and computes percentages', () => {
    const entries: Pick<WeeklyEntryRaw, 'detected_emotions'>[] = [
      { detected_emotions: ['alegria', 'calma'] },
      { detected_emotions: ['alegria'] },
      { detected_emotions: ['tristeza'] },
    ];
    const result = aggregateEmotions(entries);
    expect(result).toHaveLength(3);
    const alegria = result.find(r => r.emotion === 'alegria')!;
    expect(alegria.count).toBe(2);
    expect(alegria.pct).toBe(50); // 2/4 = 50%
  });

  it('sorts by count descending', () => {
    const entries: Pick<WeeklyEntryRaw, 'detected_emotions'>[] = [
      { detected_emotions: ['tristeza'] },
      { detected_emotions: ['alegria', 'alegria'] }, // 2 alegria
    ];
    // tristeza=1, alegria=2 (two separate emotion entries from alegria appearing twice isn't how it works)
    // actually alegria appears once per entry, we count per entry
    const entries2: Pick<WeeklyEntryRaw, 'detected_emotions'>[] = [
      { detected_emotions: ['tristeza', 'miedo', 'enojo'] },
      { detected_emotions: ['alegria', 'alegria'] }, // 2 x alegria in same entry
    ];
    const result = aggregateEmotions(entries2);
    expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
  });

  it('handles entries with no emotions', () => {
    const entries: Pick<WeeklyEntryRaw, 'detected_emotions'>[] = [
      { detected_emotions: [] },
      { detected_emotions: [] },
    ];
    expect(aggregateEmotions(entries)).toEqual([]);
  });
});

// ---- averageSentiment ----

describe('averageSentiment', () => {
  it('returns 0 for no entries', () => {
    expect(averageSentiment([])).toBe(0);
  });

  it('returns 0 when all scores are null', () => {
    expect(averageSentiment([{ sentiment_score: null }, { sentiment_score: null }])).toBe(0);
  });

  it('ignores null scores in average', () => {
    const entries = [
      { sentiment_score: 0.8 },
      { sentiment_score: null },
      { sentiment_score: 0.4 },
    ];
    const result = averageSentiment(entries);
    expect(result).toBeCloseTo(0.6, 5);
  });

  it('handles negative scores', () => {
    const entries = [{ sentiment_score: -0.5 }, { sentiment_score: -0.3 }];
    expect(averageSentiment(entries)).toBeCloseTo(-0.4, 5);
  });

  it('handles perfect positive score', () => {
    expect(averageSentiment([{ sentiment_score: 1 }])).toBe(1);
  });
});

// ---- buildTimelinePoints ----

describe('buildTimelinePoints', () => {
  it('returns 7 points', () => {
    const points = buildTimelinePoints([]);
    expect(points).toHaveLength(7);
  });

  it('marks today as talked when an entry exists for today', () => {
    const today = new Date().toISOString().split('T')[0];
    const entries = [{ sentiment_score: 0.5, created_at: today + 'T10:00:00Z' }];
    const points = buildTimelinePoints(entries);
    const todayPoint = points[points.length - 1];
    expect(todayPoint.talked).toBe(true);
    expect(todayPoint.score).toBe(0.5);
  });

  it('marks days with no entry as not talked', () => {
    const points = buildTimelinePoints([]);
    points.forEach(p => {
      expect(p.talked).toBe(false);
      expect(p.score).toBeNull();
    });
  });

  it('assigns correct day labels (Mon-Sun cycle)', () => {
    const points = buildTimelinePoints([]);
    const validLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    points.forEach(p => {
      expect(validLabels).toContain(p.label);
    });
  });
});
