import { html } from "lit";
import { buildUsageAggregateTail, mergeUsageDailyLatency, mergeUsageLatency, } from "../../../../src/shared/usage-aggregates.js";
const CHARS_PER_TOKEN = 4;
function charsToTokens(chars) {
    return Math.round(chars / CHARS_PER_TOKEN);
}
function formatTokens(n) {
    if (n >= 1_000_000) {
        return `${(n / 1_000_000).toFixed(1)}M`;
    }
    if (n >= 1_000) {
        return `${(n / 1_000).toFixed(1)}K`;
    }
    return String(n);
}
function formatHourLabel(hour) {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString(undefined, { hour: "numeric" });
}
function buildPeakErrorHours(sessions, timeZone) {
    const hourErrors = Array.from({ length: 24 }, () => 0);
    const hourMsgs = Array.from({ length: 24 }, () => 0);
    for (const session of sessions) {
        const usage = session.usage;
        if (!usage?.messageCounts || usage.messageCounts.total === 0) {
            continue;
        }
        const start = usage.firstActivity ?? session.updatedAt;
        const end = usage.lastActivity ?? session.updatedAt;
        if (!start || !end) {
            continue;
        }
        const startMs = Math.min(start, end);
        const endMs = Math.max(start, end);
        const durationMs = Math.max(endMs - startMs, 1);
        const totalMinutes = durationMs / 60000;
        let cursor = startMs;
        while (cursor < endMs) {
            const date = new Date(cursor);
            const hour = getZonedHour(date, timeZone);
            const nextHour = setToHourEnd(date, timeZone);
            const nextMs = Math.min(nextHour.getTime(), endMs);
            const minutes = Math.max((nextMs - cursor) / 60000, 0);
            const share = minutes / totalMinutes;
            hourErrors[hour] += usage.messageCounts.errors * share;
            hourMsgs[hour] += usage.messageCounts.total * share;
            cursor = nextMs + 1;
        }
    }
    return hourMsgs
        .map((msgs, hour) => {
        const errors = hourErrors[hour];
        const rate = msgs > 0 ? errors / msgs : 0;
        return {
            hour,
            rate,
            errors,
            msgs,
        };
    })
        .filter((entry) => entry.msgs > 0 && entry.errors > 0)
        .toSorted((a, b) => b.rate - a.rate)
        .slice(0, 5)
        .map((entry) => ({
        label: formatHourLabel(entry.hour),
        value: `${(entry.rate * 100).toFixed(2)}%`,
        sub: `${Math.round(entry.errors)} errors · ${Math.round(entry.msgs)} msgs`,
    }));
}
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function getZonedHour(date, zone) {
    return zone === "utc" ? date.getUTCHours() : date.getHours();
}
function getZonedWeekday(date, zone) {
    return zone === "utc" ? date.getUTCDay() : date.getDay();
}
function setToHourEnd(date, zone) {
    const next = new Date(date);
    if (zone === "utc") {
        next.setUTCMinutes(59, 59, 999);
    }
    else {
        next.setMinutes(59, 59, 999);
    }
    return next;
}
function buildUsageMosaicStats(sessions, timeZone) {
    const hourTotals = Array.from({ length: 24 }, () => 0);
    const weekdayTotals = Array.from({ length: 7 }, () => 0);
    let totalTokens = 0;
    let hasData = false;
    for (const session of sessions) {
        const usage = session.usage;
        if (!usage || !usage.totalTokens || usage.totalTokens <= 0) {
            continue;
        }
        totalTokens += usage.totalTokens;
        const start = usage.firstActivity ?? session.updatedAt;
        const end = usage.lastActivity ?? session.updatedAt;
        if (!start || !end) {
            continue;
        }
        hasData = true;
        const startMs = Math.min(start, end);
        const endMs = Math.max(start, end);
        const durationMs = Math.max(endMs - startMs, 1);
        const totalMinutes = durationMs / 60000;
        let cursor = startMs;
        while (cursor < endMs) {
            const date = new Date(cursor);
            const hour = getZonedHour(date, timeZone);
            const weekday = getZonedWeekday(date, timeZone);
            const nextHour = setToHourEnd(date, timeZone);
            const nextMs = Math.min(nextHour.getTime(), endMs);
            const minutes = Math.max((nextMs - cursor) / 60000, 0);
            const share = minutes / totalMinutes;
            hourTotals[hour] += usage.totalTokens * share;
            weekdayTotals[weekday] += usage.totalTokens * share;
            cursor = nextMs + 1;
        }
    }
    const weekdayLabels = WEEKDAYS.map((label, index) => ({
        label,
        tokens: weekdayTotals[index],
    }));
    return {
        hasData,
        totalTokens,
        hourTotals,
        weekdayTotals: weekdayLabels,
    };
}
function renderUsageMosaic(sessions, timeZone, selectedHours, onSelectHour) {
    const stats = buildUsageMosaicStats(sessions, timeZone);
    if (!stats.hasData) {
        return html `
      <div class="card usage-mosaic">
        <div class="usage-mosaic-header">
          <div>
            <div class="usage-mosaic-title">Activity by Time</div>
            <div class="usage-mosaic-sub">Estimates require session timestamps.</div>
          </div>
          <div class="usage-mosaic-total">${formatTokens(0)} tokens</div>
        </div>
        <div class="muted" style="padding: 12px; text-align: center;">No timeline data yet.</div>
      </div>
    `;
    }
    const maxHour = Math.max(...stats.hourTotals, 1);
    const maxWeekday = Math.max(...stats.weekdayTotals.map((d) => d.tokens), 1);
    return html `
    <div class="card usage-mosaic">
      <div class="usage-mosaic-header">
        <div>
          <div class="usage-mosaic-title">Activity by Time</div>
          <div class="usage-mosaic-sub">
            Estimated from session spans (first/last activity). Time zone: ${timeZone === "utc" ? "UTC" : "Local"}.
          </div>
        </div>
        <div class="usage-mosaic-total">${formatTokens(stats.totalTokens)} tokens</div>
      </div>
      <div class="usage-mosaic-grid">
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">Day of Week</div>
          <div class="usage-daypart-grid">
            ${stats.weekdayTotals.map((part) => {
        const intensity = Math.min(part.tokens / maxWeekday, 1);
        const bg = part.tokens > 0 ? `rgba(255, 77, 77, ${0.12 + intensity * 0.6})` : "transparent";
        return html `
                <div class="usage-daypart-cell" style="background: ${bg};">
                  <div class="usage-daypart-label">${part.label}</div>
                  <div class="usage-daypart-value">${formatTokens(part.tokens)}</div>
                </div>
              `;
    })}
          </div>
        </div>
        <div class="usage-mosaic-section">
          <div class="usage-mosaic-section-title">
            <span>Hours</span>
            <span class="usage-mosaic-sub">0 → 23</span>
          </div>
          <div class="usage-hour-grid">
            ${stats.hourTotals.map((value, hour) => {
        const intensity = Math.min(value / maxHour, 1);
        const bg = value > 0 ? `rgba(255, 77, 77, ${0.08 + intensity * 0.7})` : "transparent";
        const title = `${hour}:00 · ${formatTokens(value)} tokens`;
        const border = intensity > 0.7 ? "rgba(255, 77, 77, 0.6)" : "rgba(255, 77, 77, 0.2)";
        const selected = selectedHours.includes(hour);
        return html `
                <div
                  class="usage-hour-cell ${selected ? "selected" : ""}"
                  style="background: ${bg}; border-color: ${border};"
                  title="${title}"
                  @click=${(e) => onSelectHour(hour, e.shiftKey)}
                ></div>
              `;
    })}
          </div>
          <div class="usage-hour-labels">
            <span>Midnight</span>
            <span>4am</span>
            <span>8am</span>
            <span>Noon</span>
            <span>4pm</span>
            <span>8pm</span>
          </div>
          <div class="usage-hour-legend">
            <span></span>
            Low → High token density
          </div>
        </div>
      </div>
    </div>
  `;
}
function formatCost(n, decimals = 2) {
    return `$${n.toFixed(decimals)}`;
}
function formatIsoDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseYmdDate(dateStr) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!match) {
        return null;
    }
    const [, y, m, d] = match;
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    return Number.isNaN(date.valueOf()) ? null : date;
}
function formatDayLabel(dateStr) {
    const date = parseYmdDate(dateStr);
    if (!date) {
        return dateStr;
    }
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function formatFullDate(dateStr) {
    const date = parseYmdDate(dateStr);
    if (!date) {
        return dateStr;
    }
    return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}
const emptyUsageTotals = () => ({
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    totalCost: 0,
    inputCost: 0,
    outputCost: 0,
    cacheReadCost: 0,
    cacheWriteCost: 0,
    missingCostEntries: 0,
});
const mergeUsageTotals = (target, source) => {
    target.input += source.input ?? 0;
    target.output += source.output ?? 0;
    target.cacheRead += source.cacheRead ?? 0;
    target.cacheWrite += source.cacheWrite ?? 0;
    target.totalTokens += source.totalTokens ?? 0;
    target.totalCost += source.totalCost ?? 0;
    target.inputCost += source.inputCost ?? 0;
    target.outputCost += source.outputCost ?? 0;
    target.cacheReadCost += source.cacheReadCost ?? 0;
    target.cacheWriteCost += source.cacheWriteCost ?? 0;
    target.missingCostEntries += source.missingCostEntries ?? 0;
};
const buildAggregatesFromSessions = (sessions, fallback) => {
    if (sessions.length === 0) {
        return (fallback ?? {
            messages: { total: 0, user: 0, assistant: 0, toolCalls: 0, toolResults: 0, errors: 0 },
            tools: { totalCalls: 0, uniqueTools: 0, tools: [] },
            byModel: [],
            byProvider: [],
            byAgent: [],
            byChannel: [],
            daily: [],
        });
    }
    const messages = { total: 0, user: 0, assistant: 0, toolCalls: 0, toolResults: 0, errors: 0 };
    const toolMap = new Map();
    const modelMap = new Map();
    const providerMap = new Map();
    const agentMap = new Map();
    const channelMap = new Map();
    const dailyMap = new Map();
    const dailyLatencyMap = new Map();
    const modelDailyMap = new Map();
    const latencyTotals = { count: 0, sum: 0, min: Number.POSITIVE_INFINITY, max: 0, p95Max: 0 };
    for (const session of sessions) {
        const usage = session.usage;
        if (!usage) {
            continue;
        }
        if (usage.messageCounts) {
            messages.total += usage.messageCounts.total;
            messages.user += usage.messageCounts.user;
            messages.assistant += usage.messageCounts.assistant;
            messages.toolCalls += usage.messageCounts.toolCalls;
            messages.toolResults += usage.messageCounts.toolResults;
            messages.errors += usage.messageCounts.errors;
        }
        if (usage.toolUsage) {
            for (const tool of usage.toolUsage.tools) {
                toolMap.set(tool.name, (toolMap.get(tool.name) ?? 0) + tool.count);
            }
        }
        if (usage.modelUsage) {
            for (const entry of usage.modelUsage) {
                const modelKey = `${entry.provider ?? "unknown"}::${entry.model ?? "unknown"}`;
                const modelExisting = modelMap.get(modelKey) ?? {
                    provider: entry.provider,
                    model: entry.model,
                    count: 0,
                    totals: emptyUsageTotals(),
                };
                modelExisting.count += entry.count;
                mergeUsageTotals(modelExisting.totals, entry.totals);
                modelMap.set(modelKey, modelExisting);
                const providerKey = entry.provider ?? "unknown";
                const providerExisting = providerMap.get(providerKey) ?? {
                    provider: entry.provider,
                    model: undefined,
                    count: 0,
                    totals: emptyUsageTotals(),
                };
                providerExisting.count += entry.count;
                mergeUsageTotals(providerExisting.totals, entry.totals);
                providerMap.set(providerKey, providerExisting);
            }
        }
        mergeUsageLatency(latencyTotals, usage.latency);
        if (session.agentId) {
            const totals = agentMap.get(session.agentId) ?? emptyUsageTotals();
            mergeUsageTotals(totals, usage);
            agentMap.set(session.agentId, totals);
        }
        if (session.channel) {
            const totals = channelMap.get(session.channel) ?? emptyUsageTotals();
            mergeUsageTotals(totals, usage);
            channelMap.set(session.channel, totals);
        }
        for (const day of usage.dailyBreakdown ?? []) {
            const daily = dailyMap.get(day.date) ?? {
                date: day.date,
                tokens: 0,
                cost: 0,
                messages: 0,
                toolCalls: 0,
                errors: 0,
            };
            daily.tokens += day.tokens;
            daily.cost += day.cost;
            dailyMap.set(day.date, daily);
        }
        for (const day of usage.dailyMessageCounts ?? []) {
            const daily = dailyMap.get(day.date) ?? {
                date: day.date,
                tokens: 0,
                cost: 0,
                messages: 0,
                toolCalls: 0,
                errors: 0,
            };
            daily.messages += day.total;
            daily.toolCalls += day.toolCalls;
            daily.errors += day.errors;
            dailyMap.set(day.date, daily);
        }
        mergeUsageDailyLatency(dailyLatencyMap, usage.dailyLatency);
        for (const day of usage.dailyModelUsage ?? []) {
            const key = `${day.date}::${day.provider ?? "unknown"}::${day.model ?? "unknown"}`;
            const existing = modelDailyMap.get(key) ?? {
                date: day.date,
                provider: day.provider,
                model: day.model,
                tokens: 0,
                cost: 0,
                count: 0,
            };
            existing.tokens += day.tokens;
            existing.cost += day.cost;
            existing.count += day.count;
            modelDailyMap.set(key, existing);
        }
    }
    const tail = buildUsageAggregateTail({
        byChannelMap: channelMap,
        latencyTotals,
        dailyLatencyMap,
        modelDailyMap,
        dailyMap,
    });
    return {
        messages,
        tools: {
            totalCalls: Array.from(toolMap.values()).reduce((sum, count) => sum + count, 0),
            uniqueTools: toolMap.size,
            tools: Array.from(toolMap.entries())
                .map(([name, count]) => ({ name, count }))
                .toSorted((a, b) => b.count - a.count),
        },
        byModel: Array.from(modelMap.values()).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
        byProvider: Array.from(providerMap.values()).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
        byAgent: Array.from(agentMap.entries())
            .map(([agentId, totals]) => ({ agentId, totals }))
            .toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
        ...tail,
    };
};
const buildUsageInsightStats = (sessions, totals, aggregates) => {
    let durationSumMs = 0;
    let durationCount = 0;
    for (const session of sessions) {
        const duration = session.usage?.durationMs ?? 0;
        if (duration > 0) {
            durationSumMs += duration;
            durationCount += 1;
        }
    }
    const avgDurationMs = durationCount ? durationSumMs / durationCount : 0;
    const throughputTokensPerMin = totals && durationSumMs > 0 ? totals.totalTokens / (durationSumMs / 60000) : undefined;
    const throughputCostPerMin = totals && durationSumMs > 0 ? totals.totalCost / (durationSumMs / 60000) : undefined;
    const errorRate = aggregates.messages.total
        ? aggregates.messages.errors / aggregates.messages.total
        : 0;
    const peakErrorDay = aggregates.daily
        .filter((day) => day.messages > 0 && day.errors > 0)
        .map((day) => ({
        date: day.date,
        errors: day.errors,
        messages: day.messages,
        rate: day.errors / day.messages,
    }))
        .toSorted((a, b) => b.rate - a.rate || b.errors - a.errors)[0];
    return {
        durationSumMs,
        durationCount,
        avgDurationMs,
        throughputTokensPerMin,
        throughputCostPerMin,
        errorRate,
        peakErrorDay,
    };
};
export { buildAggregatesFromSessions, buildPeakErrorHours, buildUsageInsightStats, charsToTokens, formatCost, formatDayLabel, formatFullDate, formatHourLabel, formatIsoDate, formatTokens, getZonedHour, renderUsageMosaic, setToHourEnd, };
