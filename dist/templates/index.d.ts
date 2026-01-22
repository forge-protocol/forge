export interface Template {
    id: string;
    name: string;
    description: string;
    category: 'token' | 'nft' | 'dao' | 'defi' | 'utility';
    features: string[];
    files: TemplateFile[];
}
export interface TemplateFile {
    path: string;
    content: string;
}
export declare const templates: Template[];
export declare function getTemplate(id: string): Template | undefined;
export declare function listTemplates(category?: string): Template[];
//# sourceMappingURL=index.d.ts.map