var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {r = Reflect.decorate(decorators, target, key, desc);}
    else {for (var i = decorators.length - 1; i >= 0; i--) {if (d = decorators[i]) {r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;}}}
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { handleChannelConfigReload as handleChannelConfigReloadInternal, handleChannelConfigSave as handleChannelConfigSaveInternal, handleNostrProfileCancel as handleNostrProfileCancelInternal, handleNostrProfileEdit as handleNostrProfileEditInternal, handleNostrProfileFieldChange as handleNostrProfileFieldChangeInternal, handleNostrProfileImport as handleNostrProfileImportInternal, handleNostrProfileSave as handleNostrProfileSaveInternal, handleNostrProfileToggleAdvanced as handleNostrProfileToggleAdvancedInternal, handleWhatsAppLogout as handleWhatsAppLogoutInternal, handleWhatsAppStart as handleWhatsAppStartInternal, handleWhatsAppWait as handleWhatsAppWaitInternal, } from "./app-channels";
import { handleAbortChat as handleAbortChatInternal, handleSendChat as handleSendChatInternal, removeQueuedMessage as removeQueuedMessageInternal, handleInjectPrompt as handleInjectPromptInternal, } from "./app-chat";
import { DEFAULT_CRON_FORM, DEFAULT_LOG_LEVEL_FILTERS } from "./app-defaults";
import { connectGateway as connectGatewayInternal } from "./app-gateway";
import { handleConnected, handleDisconnected, handleFirstUpdated, handleUpdated, } from "./app-lifecycle";
import { renderApp } from "./app-render";
import { exportLogs as exportLogsInternal, handleChatScroll as handleChatScrollInternal, handleLogsScroll as handleLogsScrollInternal, resetChatScroll as resetChatScrollInternal, } from "./app-scroll";
import { applySettings as applySettingsInternal, loadCron as loadCronInternal, loadOverview as loadOverviewInternal, setTab as setTabInternal, setTheme as setThemeInternal, onPopState as onPopStateInternal, } from "./app-settings";
import { resetToolStream as resetToolStreamInternal, } from "./app-tool-stream";
import { resolveInjectedAssistantIdentity } from "./assistant-identity";
import { loadAssistantIdentity as loadAssistantIdentityInternal } from "./controllers/assistant-identity";
import { loadSettings } from "./storage";
const injectedAssistantIdentity = resolveInjectedAssistantIdentity();
function resolveOnboardingMode() {
    if (!window.location.search) {
        return false;
    }
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("onboarding");
    if (!raw) {
        return false;
    }
    const normalized = raw.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}
let OpenClawApp = class OpenClawApp extends LitElement {
    constructor() {
        super(...arguments);
        this.settings = loadSettings();
        this.password = "";
        this.tab = "chat";
        this.onboarding = resolveOnboardingMode();
        this.connected = false;
        this.theme = this.settings.theme ?? "system";
        this.themeResolved = "dark";
        this.hello = null;
        this.lastError = null;
        this.eventLog = [];
        this.eventLogBuffer = [];
        this.toolStreamSyncTimer = null;
        this.sidebarCloseTimer = null;
        this.assistantName = injectedAssistantIdentity.name;
        this.assistantAvatar = injectedAssistantIdentity.avatar;
        this.assistantAgentId = injectedAssistantIdentity.agentId ?? null;
        this.sessionKey = this.settings.sessionKey;
        this.chatLoading = false;
        this.chatSending = false;
        this.chatMessage = "";
        this.chatMessages = [];
        this.chatToolMessages = [];
        this.chatStream = null;
        this.chatStreamStartedAt = null;
        this.chatRunId = null;
        this.compactionStatus = null;
        this.chatAvatarUrl = null;
        this.chatThinkingLevel = null;
        this.chatQueue = [];
        this.chatAttachments = [];
        // Sidebar state for tool output viewing
        this.sidebarOpen = false;
        this.sidebarContent = null;
        this.sidebarError = null;
        this.splitRatio = this.settings.splitRatio;
        this.nodesLoading = false;
        this.nodes = [];
        this.devicesLoading = false;
        this.devicesError = null;
        this.devicesList = null;
        this.execApprovalsLoading = false;
        this.execApprovalsSaving = false;
        this.execApprovalsDirty = false;
        this.execApprovalsSnapshot = null;
        this.execApprovalsForm = null;
        this.execApprovalsSelectedAgent = null;
        this.execApprovalsTarget = "gateway";
        this.execApprovalsTargetNodeId = null;
        this.execApprovalQueue = [];
        this.execApprovalBusy = false;
        this.execApprovalError = null;
        this.pendingGatewayUrl = null;
        this.configLoading = false;
        this.configRaw = "{\n}\n";
        this.configRawOriginal = "";
        this.configValid = null;
        this.configIssues = [];
        this.configSaving = false;
        this.configApplying = false;
        this.updateRunning = false;
        this.applySessionKey = this.settings.lastActiveSessionKey;
        this.configSnapshot = null;
        this.configSchema = null;
        this.configSchemaVersion = null;
        this.configSchemaLoading = false;
        this.configUiHints = {};
        this.configForm = null;
        this.configFormOriginal = null;
        this.configFormDirty = false;
        this.configFormMode = "form";
        this.configSearchQuery = "";
        this.configActiveSection = null;
        this.configActiveSubsection = null;
        this.channelsLoading = false;
        this.channelsSnapshot = null;
        this.channelsError = null;
        this.channelsLastSuccess = null;
        this.whatsappLoginMessage = null;
        this.whatsappLoginQrDataUrl = null;
        this.whatsappLoginConnected = null;
        this.whatsappBusy = false;
        this.nostrProfileFormState = null;
        this.nostrProfileAccountId = null;
        this.presenceLoading = false;
        this.presenceEntries = [];
        this.presenceError = null;
        this.presenceStatus = null;
        this.agentsLoading = false;
        this.agentsList = null;
        this.agentsError = null;
        this.sessionsLoading = false;
        this.sessionsResult = null;
        this.sessionsError = null;
        this.sessionsFilterActive = "";
        this.sessionsFilterLimit = "120";
        this.sessionsIncludeGlobal = true;
        this.sessionsIncludeUnknown = false;
        this.cronLoading = false;
        this.cronJobs = [];
        this.cronStatus = null;
        this.cronError = null;
        this.cronForm = { ...DEFAULT_CRON_FORM };
        this.cronRunsJobId = null;
        this.cronRuns = [];
        this.cronBusy = false;
        this.skillsLoading = false;
        this.skillsReport = null;
        this.skillsError = null;
        this.skillsFilter = "";
        this.skillEdits = {};
        this.skillsBusyKey = null;
        this.skillMessages = {};
        this.debugLoading = false;
        this.debugStatus = null;
        this.debugHealth = null;
        this.debugModels = [];
        this.debugHeartbeat = null;
        this.debugCallMethod = "";
        this.debugCallParams = "{}";
        this.debugCallResult = null;
        this.debugCallError = null;
        this.logsLoading = false;
        this.logsError = null;
        this.logsFile = null;
        this.logsEntries = [];
        this.logsFilterText = "";
        this.logsLevelFilters = {
            ...DEFAULT_LOG_LEVEL_FILTERS,
        };
        this.logsAutoFollow = true;
        this.logsTruncated = false;
        this.logsCursor = null;
        this.logsLastFetchAt = null;
        this.logsLimit = 500;
        this.logsMaxBytes = 250_000;
        this.logsAtBottom = true;
        this.client = null;
        this.chatScrollFrame = null;
        this.chatScrollTimeout = null;
        this.chatHasAutoScrolled = false;
        this.chatUserNearBottom = true;
        this.nodesPollInterval = null;
        this.logsPollInterval = null;
        this.debugPollInterval = null;
        this.logsScrollFrame = null;
        this.toolStreamById = new Map();
        this.toolStreamOrder = [];
        this.refreshSessionsAfterChat = new Set();
        this.basePath = "";
        this.popStateHandler = () => onPopStateInternal(this);
        this.injectPromptHandler = null;
        this.themeMedia = null;
        this.themeMediaHandler = null;
        this.topbarObserver = null;
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        handleConnected(this);
    }
    firstUpdated() {
        handleFirstUpdated(this);
    }
    disconnectedCallback() {
        handleDisconnected(this);
        super.disconnectedCallback();
    }
    updated(changed) {
        handleUpdated(this, changed);
    }
    connect() {
        connectGatewayInternal(this);
    }
    handleChatScroll(event) {
        handleChatScrollInternal(this, event);
    }
    handleLogsScroll(event) {
        handleLogsScrollInternal(this, event);
    }
    exportLogs(lines, label) {
        exportLogsInternal(lines, label);
    }
    resetToolStream() {
        resetToolStreamInternal(this);
    }
    resetChatScroll() {
        resetChatScrollInternal(this);
    }
    async loadAssistantIdentity() {
        await loadAssistantIdentityInternal(this);
    }
    applySettings(next) {
        applySettingsInternal(this, next);
    }
    setTab(next) {
        setTabInternal(this, next);
    }
    setTheme(next, context) {
        setThemeInternal(this, next, context);
    }
    async loadOverview() {
        await loadOverviewInternal(this);
    }
    async loadCron() {
        await loadCronInternal(this);
    }
    async handleAbortChat() {
        await handleAbortChatInternal(this);
    }
    removeQueuedMessage(id) {
        removeQueuedMessageInternal(this, id);
    }
    handleInjectPrompt(detail) {
        handleInjectPromptInternal(this, detail);
    }
    async handleSendChat(messageOverride, opts) {
        await handleSendChatInternal(this, messageOverride, opts);
    }
    async handleWhatsAppStart(force) {
        await handleWhatsAppStartInternal(this, force);
    }
    async handleWhatsAppWait() {
        await handleWhatsAppWaitInternal(this);
    }
    async handleWhatsAppLogout() {
        await handleWhatsAppLogoutInternal(this);
    }
    async handleChannelConfigSave() {
        await handleChannelConfigSaveInternal(this);
    }
    async handleChannelConfigReload() {
        await handleChannelConfigReloadInternal(this);
    }
    handleNostrProfileEdit(accountId, profile) {
        handleNostrProfileEditInternal(this, accountId, profile);
    }
    handleNostrProfileCancel() {
        handleNostrProfileCancelInternal(this);
    }
    handleNostrProfileFieldChange(field, value) {
        handleNostrProfileFieldChangeInternal(this, field, value);
    }
    async handleNostrProfileSave() {
        await handleNostrProfileSaveInternal(this);
    }
    async handleNostrProfileImport() {
        await handleNostrProfileImportInternal(this);
    }
    handleNostrProfileToggleAdvanced() {
        handleNostrProfileToggleAdvancedInternal(this);
    }
    async handleExecApprovalDecision(decision) {
        const active = this.execApprovalQueue[0];
        if (!active || !this.client || this.execApprovalBusy) {
            return;
        }
        this.execApprovalBusy = true;
        this.execApprovalError = null;
        try {
            await this.client.request("exec.approval.resolve", {
                id: active.id,
                decision,
            });
            this.execApprovalQueue = this.execApprovalQueue.filter((entry) => entry.id !== active.id);
        }
        catch (err) {
            this.execApprovalError = `Exec approval failed: ${String(err)}`;
        }
        finally {
            this.execApprovalBusy = false;
        }
    }
    handleGatewayUrlConfirm() {
        const nextGatewayUrl = this.pendingGatewayUrl;
        if (!nextGatewayUrl) {
            return;
        }
        this.pendingGatewayUrl = null;
        applySettingsInternal(this, {
            ...this.settings,
            gatewayUrl: nextGatewayUrl,
        });
        this.connect();
    }
    handleGatewayUrlCancel() {
        this.pendingGatewayUrl = null;
    }
    // Sidebar handlers for tool output viewing
    handleOpenSidebar(content) {
        if (this.sidebarCloseTimer != null) {
            window.clearTimeout(this.sidebarCloseTimer);
            this.sidebarCloseTimer = null;
        }
        this.sidebarContent = content;
        this.sidebarError = null;
        this.sidebarOpen = true;
    }
    handleCloseSidebar() {
        this.sidebarOpen = false;
        // Clear content after transition
        if (this.sidebarCloseTimer != null) {
            window.clearTimeout(this.sidebarCloseTimer);
        }
        this.sidebarCloseTimer = window.setTimeout(() => {
            if (this.sidebarOpen) {
                return;
            }
            this.sidebarContent = null;
            this.sidebarError = null;
            this.sidebarCloseTimer = null;
        }, 200);
    }
    handleSplitRatioChange(ratio) {
        const newRatio = Math.max(0.4, Math.min(0.7, ratio));
        this.splitRatio = newRatio;
        this.applySettings({ ...this.settings, splitRatio: newRatio });
    }
    render() {
        return renderApp(this);
    }
};
__decorate([
    state()
], OpenClawApp.prototype, "settings", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "password", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "tab", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "onboarding", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "connected", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "theme", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "themeResolved", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "hello", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "lastError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "eventLog", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "assistantName", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "assistantAvatar", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "assistantAgentId", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionKey", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatSending", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatMessage", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatMessages", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatToolMessages", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatStream", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatStreamStartedAt", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatRunId", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "compactionStatus", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatAvatarUrl", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatThinkingLevel", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatQueue", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "chatAttachments", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sidebarOpen", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sidebarContent", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sidebarError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "splitRatio", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "nodesLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "nodes", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "devicesLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "devicesError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "devicesList", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsSaving", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsDirty", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsSnapshot", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsForm", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsSelectedAgent", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsTarget", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalsTargetNodeId", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalQueue", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalBusy", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "execApprovalError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "pendingGatewayUrl", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configRaw", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configRawOriginal", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configValid", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configIssues", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configSaving", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configApplying", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "updateRunning", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "applySessionKey", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configSnapshot", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configSchema", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configSchemaVersion", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configSchemaLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configUiHints", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configForm", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configFormOriginal", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configFormDirty", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configFormMode", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configSearchQuery", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configActiveSection", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "configActiveSubsection", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "channelsLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "channelsSnapshot", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "channelsError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "channelsLastSuccess", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "whatsappLoginMessage", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "whatsappLoginQrDataUrl", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "whatsappLoginConnected", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "whatsappBusy", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "nostrProfileFormState", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "nostrProfileAccountId", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "presenceLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "presenceEntries", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "presenceError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "presenceStatus", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "agentsLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "agentsList", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "agentsError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsResult", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsFilterActive", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsFilterLimit", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsIncludeGlobal", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "sessionsIncludeUnknown", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronJobs", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronStatus", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronForm", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronRunsJobId", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronRuns", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "cronBusy", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillsLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillsReport", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillsError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillsFilter", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillEdits", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillsBusyKey", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "skillMessages", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugStatus", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugHealth", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugModels", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugHeartbeat", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugCallMethod", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugCallParams", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugCallResult", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "debugCallError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsLoading", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsError", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsFile", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsEntries", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsFilterText", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsLevelFilters", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsAutoFollow", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsTruncated", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsCursor", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsLastFetchAt", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsLimit", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsMaxBytes", void 0);
__decorate([
    state()
], OpenClawApp.prototype, "logsAtBottom", void 0);
OpenClawApp = __decorate([
    customElement("openclaw-app")
], OpenClawApp);
export { OpenClawApp };
