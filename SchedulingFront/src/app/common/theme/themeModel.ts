export class Theme {
    name: string;
    isSystem: boolean;
    themeOptions: ThemeOptions;
    active: boolean;
    themeId: number;
}

export class ThemeOptions {
    backgroundColor: string;
    buttonColor: string;
    headingColor: string;
    value: string;
}