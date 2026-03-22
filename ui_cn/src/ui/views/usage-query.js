import { extractQueryTerms } from "../usage-helpers.ts";
function downloadTextFile(filename, content, type = "text/plain") {
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function csvEscape(value) {
    if (/[",\n]/.test(value)) {
        return `"${value.replaceAll('"', '""')}"`;
    }
    return value;
}
function toCsvRow(values) {
    return values
        .map((value) => {
        if (value === undefined || value === null) {
            return "";
        }
        return csvEscape(String(value));
    })
        .join(",");
}
const buildSessionsCsv = (sessions) => {
    const rows = [
        toCsvRow([
            "key",
            "label",
            "agentId",
            "channel",
            "provider",
            "model",
            "updatedAt",
            "durationMs",
            "messages",
            "errors",
            "toolCalls",
            "inputTokens",
            "outputTokens",
            "cacheReadTokens",
            "cacheWriteTokens",
            "totalTokens",
            "totalCost",
        ]),
    ];
    for (const session of sessions) {
        const usage = session.usage;
        rows.push(toCsvRow([
            session.key,
            session.label ?? "",
            session.agentId ?? "",
            session.channel ?? "",
            session.modelProvider ?? session.providerOverride ?? "",
            session.model ?? session.modelOverride ?? "",
            session.updatedAt ? new Date(session.updatedAt).toISOString() : "",
            usage?.durationMs ?? "",
            usage?.messageCounts?.total ?? "",
            usage?.messageCounts?.errors ?? "",
            usage?.messageCounts?.toolCalls ?? "",
            usage?.input ?? "",
            usage?.output ?? "",
            usage?.cacheRead ?? "",
            usage?.cacheWrite ?? "",
            usage?.totalTokens ?? "",
            usage?.totalCost ?? "",
        ]));
    }
    return rows.join("\n");
};
const buildDailyCsv = (daily) => {
    const rows = [
        toCsvRow([
            "date",
            "inputTokens",
            "outputTokens",
            "cacheReadTokens",
            "cacheWriteTokens",
            "totalTokens",
            "inputCost",
            "outputCost",
            "cacheReadCost",
            "cacheWriteCost",
            "totalCost",
        ]),
    ];
    for (const day of daily) {
        rows.push(toCsvRow([
            day.date,
            day.input,
            day.output,
            day.cacheRead,
            day.cacheWrite,
            day.totalTokens,
            day.inputCost ?? "",
            day.outputCost ?? "",
            day.cacheReadCost ?? "",
            day.cacheWriteCost ?? "",
            day.totalCost,
        ]));
    }
    return rows.join("\n");
};
const buildQuerySuggestions = (query, sessions, aggregates) => {
    const trimmed = query.trim();
    if (!trimmed) {
        return [];
    }
    const tokens = trimmed.length ? trimmed.split(/\s+/) : [];
    const lastToken = tokens.length ? tokens[tokens.length - 1] : "";
    const [rawKey, rawValue] = lastToken.includes(":")
        ? [lastToken.slice(0, lastToken.indexOf(":")), lastToken.slice(lastToken.indexOf(":") + 1)]
        : ["", ""];
    const key = rawKey.toLowerCase();
    const value = rawValue.toLowerCase();
    const unique = (items) => {
        const set = new Set();
        for (const item of items) {
            if (item) {
                set.add(item);
            }
        }
        return Array.from(set);
    };
    const agents = unique(sessions.map((s) => s.agentId)).slice(0, 6);
    const channels = unique(sessions.map((s) => s.channel)).slice(0, 6);
    const providers = unique([
        ...sessions.map((s) => s.modelProvider),
        ...sessions.map((s) => s.providerOverride),
        ...(aggregates?.byProvider.map((p) => p.provider) ?? []),
    ]).slice(0, 6);
    const models = unique([
        ...sessions.map((s) => s.model),
        ...(aggregates?.byModel.map((m) => m.model) ?? []),
    ]).slice(0, 6);
    const tools = unique(aggregates?.tools.tools.map((t) => t.name) ?? []).slice(0, 6);
    if (!key) {
        return [
            { label: "agent:", value: "agent:" },
            { label: "channel:", value: "channel:" },
            { label: "provider:", value: "provider:" },
            { label: "model:", value: "model:" },
            { label: "tool:", value: "tool:" },
            { label: "has:errors", value: "has:errors" },
            { label: "has:tools", value: "has:tools" },
            { label: "minTokens:", value: "minTokens:" },
            { label: "maxCost:", value: "maxCost:" },
        ];
    }
    const suggestions = [];
    const addValues = (prefix, values) => {
        for (const val of values) {
            if (!value || val.toLowerCase().includes(value)) {
                suggestions.push({ label: `${prefix}:${val}`, value: `${prefix}:${val}` });
            }
        }
    };
    switch (key) {
        case "agent":
            addValues("agent", agents);
            break;
        case "channel":
            addValues("channel", channels);
            break;
        case "provider":
            addValues("provider", providers);
            break;
        case "model":
            addValues("model", models);
            break;
        case "tool":
            addValues("tool", tools);
            break;
        case "has":
            ["errors", "tools", "context", "usage", "model", "provider"].forEach((entry) => {
                if (!value || entry.includes(value)) {
                    suggestions.push({ label: `has:${entry}`, value: `has:${entry}` });
                }
            });
            break;
        default:
            break;
    }
    return suggestions;
};
const applySuggestionToQuery = (query, suggestion) => {
    const trimmed = query.trim();
    if (!trimmed) {
        return `${suggestion} `;
    }
    const tokens = trimmed.split(/\s+/);
    tokens[tokens.length - 1] = suggestion;
    return `${tokens.join(" ")} `;
};
const normalizeQueryText = (value) => value.trim().toLowerCase();
const addQueryToken = (query, token) => {
    const trimmed = query.trim();
    if (!trimmed) {
        return `${token} `;
    }
    const tokens = trimmed.split(/\s+/);
    const last = tokens[tokens.length - 1] ?? "";
    const tokenKey = token.includes(":") ? token.split(":")[0] : null;
    const lastKey = last.includes(":") ? last.split(":")[0] : null;
    if (last.endsWith(":") && tokenKey && lastKey === tokenKey) {
        tokens[tokens.length - 1] = token;
        return `${tokens.join(" ")} `;
    }
    if (tokens.includes(token)) {
        return `${tokens.join(" ")} `;
    }
    return `${tokens.join(" ")} ${token} `;
};
const removeQueryToken = (query, token) => {
    const tokens = query.trim().split(/\s+/).filter(Boolean);
    const next = tokens.filter((entry) => entry !== token);
    return next.length ? `${next.join(" ")} ` : "";
};
const setQueryTokensForKey = (query, key, values) => {
    const normalizedKey = normalizeQueryText(key);
    const tokens = extractQueryTerms(query)
        .filter((term) => normalizeQueryText(term.key ?? "") !== normalizedKey)
        .map((term) => term.raw);
    const next = [...tokens, ...values.map((value) => `${key}:${value}`)];
    return next.length ? `${next.join(" ")} ` : "";
};
export { addQueryToken, applySuggestionToQuery, buildDailyCsv, buildQuerySuggestions, buildSessionsCsv, downloadTextFile, normalizeQueryText, removeQueryToken, setQueryTokensForKey, };
