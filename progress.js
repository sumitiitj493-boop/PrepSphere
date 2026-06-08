// PrepSphere Progress System v2
// Handles per-concept tracking, topic-level rollups, and overall progress.

const Progress = {
  TOTAL_TOPICS: 14,
  _key: 'prepsphere_completed',

  getCompleted() {
    try {
      const raw = localStorage.getItem(this._key);
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  markComplete(conceptId) {
    const completed = this.getCompleted();
    const id = String(conceptId);
    if (!completed.includes(id)) {
      completed.push(id);
      localStorage.setItem(this._key, JSON.stringify(completed));
    }
    return this;
  },

  unmarkComplete(conceptId) {
    const id = String(conceptId);
    const completed = this.getCompleted().filter(c => c !== id);
    localStorage.setItem(this._key, JSON.stringify(completed));
    return this;
  },

  isCompleted(conceptId) {
    return this.getCompleted().includes(String(conceptId));
  },

  // Returns 0–100 integer based on unique topics touched
  getOverallProgress() {
    const completed = this.getCompleted();
    const topicsWithProgress = new Set(
      completed.map(id => String(id).split('-')[0])
    );
    const count = Math.min(topicsWithProgress.size, this.TOTAL_TOPICS);
    return Math.round((count / this.TOTAL_TOPICS) * 100);
  },

  // Number of completed items for a given topic prefix, e.g. "dbms"
  getTopicProgress(topicPrefix) {
    const prefix = String(topicPrefix).toLowerCase() + '-';
    return this.getCompleted().filter(id => String(id).toLowerCase().startsWith(prefix)).length;
  },

  // All unique topics that have at least one completed item
  getCompletedTopics() {
    const completed = this.getCompleted();
    return [...new Set(completed.map(id => String(id).split('-')[0]))];
  },

  reset() {
    localStorage.removeItem(this._key);
    return this;
  }
};

window.Progress = Progress;
