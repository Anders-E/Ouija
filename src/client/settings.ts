export class Settings {
    private static instance: Settings;

    private isAudioMuted: boolean = false;

    public constructor() {}

    public static getInstance(): Settings {
        if (this.instance == null) {
            this.instance = new Settings();
        }
        return this.instance;
    }

    public isMuted(): boolean {
        return this.isAudioMuted;
    }

    public mute(): void {
        this.isAudioMuted = true;
    }

    public unmute(): void {
        this.isAudioMuted = false;
    }
}
