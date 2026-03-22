import { stripReasoningTagsFromText } from "../../../src/shared/text/reasoning-tags.js";
export function formatMs(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    return new Date(ms).toLocaleString();
}
export function formatAgo(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    const diff = Date.now() - ms;
    if (diff < 0) {
        return "just now";
    }
    const sec = Math.round(diff / 1000);
    if (sec < 60) {
        return `${sec}s ago`;
    }
    const min = Math.round(sec / 60);
    if (min < 60) {
        return `${min}m ago`;
    }
    const hr = Math.round(min / 60);
    if (hr < 48) {
        return `${hr}h ago`;
    }
    const day = Math.round(hr / 24);
    return `${day}d ago`;
}
export function formatDurationMs(ms) {
    if (!ms && ms !== 0) {
        return "n/a";
    }
    if (ms < 1000) {
        return `${ms}ms`;
    }
    const sec = Math.round(ms / 1000);
    if (sec < 60) {
        return `${sec}s`;
    }
    const min = Math.round(sec / 60);
    if (min < 60) {
        return `${min}m`;
    }
    const hr = Math.round(min / 60);
    if (hr < 48) {
        return `${hr}h`;
    }
    const day = Math.round(hr / 24);
    return `${day}d`;
}
export function formatList(values) {
    if (!values || values.length === 0) {
        return "none";
    }
    return values.filter((v) => Boolean(v && v.trim())).join(", ");
}
export function clampText(value, max = 120) {
    if (value.length <= max) {
        return value;
    }
    return `${value.slice(0, Math.max(0, max - 1))}…`;
}
export function truncateText(value, max) {
    if (value.length <= max) {
        return { text: value, truncated: false, total: value.length };
    }
    return {
        text: value.slice(0, Math.max(0, max)),
        truncated: true,
        total: value.length,
    };
}
export function toNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}
export function parseList(input) {
    return input
        .split(/[,\n]/)
        .map((v) => v.trim())
        .filter((v) => v.length > 0);
}
export function stripThinkingTags(value) {
    return stripReasoningTagsFromText(value, { mode: "preserve", trim: "start" });
}
