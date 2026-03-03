export declare class MimiumEditorElement extends HTMLElement {
    private mimiumWebAudioModule;
    private editorContainer;
    private monacoEditor;
    private audioContext;
    private mimiumNode;
    private microphone;
    private playButton;
    private stopButton;
    private updateButton;
    private statusDot;
    private statusText;
    private errorText;
    private labelEl;
    private _initialCode;
    private _isPlaying;
    private runtimeErrorListener;
    private static readonly COMPILE_TIMEOUT_MS;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldValue: string, newValue: string): void;
    private getEditorHeight;
    private getTheme;
    private isReadonly;
    private getInitialCode;
    private render;
    private setupEditor;
    private setStatus;
    private setError;
    private withTimeout;
    private formatError;
    private getSetupOptions;
    private loadMimiumWebAudioModule;
    private preloadLibCacheIfAvailable;
    private detachRuntimeErrorListener;
    private createCompiledNode;
    /**
     * Play the current code
     */
    play(): Promise<void>;
    /**
     * Stop audio playback
     */
    stopAudio(): Promise<void>;
    /**
     * Send updated code to running audio processor
     */
    updateCode(): Promise<void>;
    /**
     * Get the current source code from the editor
     */
    getSource(): string;
    /**
     * Set the source code in the editor
     */
    setSource(code: string): void;
    get isPlaying(): boolean;
}
export default MimiumEditorElement;
