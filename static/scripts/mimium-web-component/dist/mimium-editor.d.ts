export declare class MimiumEditorElement extends HTMLElement {
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
    private labelEl;
    private _initialCode;
    private _isPlaying;
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
    updateCode(): void;
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
